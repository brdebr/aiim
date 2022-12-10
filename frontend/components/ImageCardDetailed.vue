<template>
  <ImageCard
    v-if="imageToShow"
    :image="imageToShow"
    :vote-type="props.vote?.vote"
  >
    <v-toolbar
      color="rgba(0, 0, 0, 0)"
      theme="dark"
      class="voted-img-toolbar"
      density="compact"
      @click.stop="false"
    >
      <template v-slot:prepend>
        <v-menu
          transition="scroll-y-transition"
          :menu-props="{ maxHeight: 400 }"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              size="x-small"
              variant="outlined"
              icon="mdi-dots-vertical"
            />
          </template>
          <v-list density="compact" class="image-menu-list bg-indigo-darken-4">
            <v-list-item @click="downloadImage(imageToShow?.id)">
              <template v-slot:prepend>
                <v-icon size="small">
                  mdi-download
                </v-icon>
              </template>
              <v-list-item-title class="!qw-text-sm">
                Download
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="copyImageInfoToClipboard(imageToShow)">
              <template v-slot:prepend>
                <v-icon size="small">
                  mdi-content-copy
                </v-icon>
              </template>
              <v-list-item-title class="!qw-text-sm">
                Send to clipboard
              </v-list-item-title>
            </v-list-item>
            <v-list-item disabled @click="() => 'hola'">
              <template v-slot:prepend>
                <v-icon size="small">
                  mdi-information
                </v-icon>
              </template>
              <v-list-item-title class="!qw-text-sm">
                Show more info
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <v-toolbar-title>
        <div class="qw-flex qw-items-center qw-gap-4">
          <v-chip label rounded="sm" color="indigo" size="x-small">
            <span
              class="qw-text-white qw-flex qw-items-baseline qw-gap-[3px] !qw-text-[11px]"
            >
              {{ imageToShow.height }} <small>px</small>
              <span class="qw-mx-[4px] qw-text-[9px]">x</span>
              {{ imageToShow.width }} <small>px</small>
            </span>
          </v-chip>
        </div>
      </v-toolbar-title>
      <template v-slot:append>
        <div class="qw-flex qw-items-center qw-gap-2">
          <v-chip label rounded="sm" color="indigo" size="small" :title="`Model used hash: ${imageToShow.modelHash}`">
            <span class="qw-text-white">
              {{ modelHashesNames[imageToShow.modelHash] }}
            </span>
          </v-chip>
          <v-chip
            class="<md:(!qw-hidden)"
            label
            rounded="sm"
            color="indigo"
            size="small"
            :title="`Sampler: ${imageToShow.sampler}`"
          >
            <span class="qw-text-white">
              {{ imageToShow.sampler }}
            </span>
          </v-chip>
          <v-chip label rounded="sm" color="indigo" size="small" :title="`Steps: ${imageToShow.steps}`">
            <span class="qw-text-white"> {{ imageToShow.steps }} it </span>
          </v-chip>
          <v-progress-circular
            :size="32"
            :width="2.5"
            color="blue"
            :model-value="percentageOfMaxCfg(imageToShow.cfg)"
            :title="`CFG: ${imageToShow.steps}`"
          >
            <span
              class="qw-text-white"
              :style="getCfgTextStyle(imageToShow.cfg)"
            >
              {{ imageToShow.cfg }}
            </span>
          </v-progress-circular>
        </div>
      </template>
    </v-toolbar>
    <div v-if="displayingInfo">
      <div>
        {{ imageToShow.prompt }}
      </div>
      <div>
        {{ imageToShow.negativePrompt }}
      </div>
    </div>
  </ImageCard>
</template>
<script setup lang="ts">
import { Vote } from '~~/composables/useVotesGallery';
import { modelHashesMap } from '~~/constants';
import { ImageObject } from '~~/types';

const displayingInfo = ref(false);
const apiBaseURL = getApiBaseURL();

const modelHashesNames: Record<string, string> = Object.fromEntries(
  Object.entries(modelHashesMap).map(([key, value]) => [value, key])
);

const MAX_CFG = 20;
const percentageOfMaxCfg = (val: number) => {
  return (val / MAX_CFG) * 100;
};
const getCfgTextStyle = (val: number) => {
  const cfgNumSize = `${val}`.replace(/(\.|\,)/, '').length;
  const fontSize =
    cfgNumSize <= 2 ? '12px' : cfgNumSize === 3 ? '10px' : '9.5px';
  const letterSpacing = cfgNumSize >= 3 ? '-0.5px' : undefined;
  return { fontSize, letterSpacing };
};

const { copy } = useClipboard();

const copyImageInfoToClipboard = (image?: ImageObject) => {
  if (!image) return;
  const imageInfo = JSON.stringify(image, null, 2);
  copy(imageInfo);
};

const downloadImage = (imageId?: string) => {
  const url = `${apiBaseURL}/api/images/view/${imageId}.png`;
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link
        .setAttribute(
          'download',
          `${imageId}.png`
        );
      link
        .setAttribute('href', url);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
}

const imageToShow = computed(() => {
  if (props.vote) return props.vote.image;
  if (props.image) return props.image;
});

const props = defineProps<{
  vote?: Vote;
  image?: ImageObject;
}>();
</script>
<style lang="scss">
.voted-img-toolbar {
  background: linear-gradient(
    0deg,
    rgba(9, 9, 119, 0) 0%,
    rgba(0, 0, 0, 1) 95%
  ) !important;
}
.image-menu-list {
  .v-list-item__prepend > .v-icon {
    margin-inline-end: 20px !important;
  }
}
</style>
