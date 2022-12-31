<template>
  <ImageCard
    v-if="imageToShow"
    :image="imageToShow"
    :vote-type="props.vote?.vote"
    :show-title="!displayingInfo"
    ref="imageCard"
  >
    <v-toolbar
      color="rgba(0, 0, 0, 0)"
      theme="dark"
      class="voted-img-toolbar"
      :class="{
        'voted-img-toolbar--detailed': displayingInfo,
      }"
      density="compact"
    >
      <template #prepend>
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
          <v-list density="compact" class="image-menu-list bg-indigo-darken-4 qw-mt-1">
            <v-list-item @click="displayingInfo = !displayingInfo">
              <template #prepend>
                <v-icon size="small">
                  mdi-information
                </v-icon>
              </template>
              <v-list-item-title class="!qw-text-sm">
                Show more info
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="showInFullscreen">
              <template #prepend>
                <v-icon size="small">
                  mdi-fullscreen
                </v-icon>
              </template>
              <v-list-item-title class="!qw-text-sm">
                Fullscreen
              </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="!hideSendToVClip" @click="sendImageInfoToVClip(imageToShow)">
              <template #prepend>
                <v-icon size="small">
                  mdi-archive-arrow-up-outline
                </v-icon>
              </template>
              <v-list-item-title class="!qw-text-sm">
                Send image to virtual clipboard
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="sendToGenerate(imageToShow)">
              <template v-slot:prepend>
                <v-icon size="small">
                  mdi-upload
                </v-icon>
              </template>
              <v-list-item-title class="!qw-text-sm">
                Send to generate
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="copyImageInfoToClipboard(imageToShow)">
              <template #prepend>
                <v-icon size="small">
                  mdi-content-copy
                </v-icon>
              </template>
              <v-list-item-title class="!qw-text-sm">
                Copy image info
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="downloadImage(imageToShow?.id)">
              <template #prepend>
                <v-icon size="small">
                  mdi-download
                </v-icon>
              </template>
              <v-list-item-title class="!qw-text-sm">
                Download
              </v-list-item-title>
            </v-list-item>
            <slot name="menu-item" />
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
      <template #append>
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
      <template #extension v-if="displayingInfo">
        <div class="qw-px-3 qw-pt-3 qw-flex qw-flex-col qw-gap-3 qw-text-sm qw-w-full qw-h-full">
          <div class="qw-grid qw-gap-3 qw-grid-cols-2 <<md:qw-grid-cols-1">
            <v-sheet rounded class="image-field-container image-field-container--small">
              <span class="image-field-container__label">
                Id:
              </span>
              <span class="qw-tracking-wide qw-text-xs">
                {{ imageToShow.id }}
              </span>
            </v-sheet>
            <v-sheet rounded class="image-field-container image-field-container--small">
              <span class="image-field-container__label">
                Date:
              </span>
              <span class="qw-tracking-wide qw-text-xs">
                {{ imageToShow.generatedAt }}
              </span>
            </v-sheet>
          </div>
          <div class="qw-grid qw-gap-3 qw-grid-cols-2 <<md:qw-grid-cols-1">
            <v-sheet rounded class="image-field-container image-field-container--small">
              <span class="image-field-container__label">
                Seed:
              </span>
              <span class="qw-tracking-wide qw-text-xs">
                {{ imageToShow.seed }}
              </span>
            </v-sheet>
            <v-sheet rounded class="image-field-container image-field-container--small">
              <span class="image-field-container__label">
                Time to generate:
              </span>
              <span class="qw-tracking-wide qw-text-xs">
                {{ formatTimeToGenerate(imageToShow.timeToGenerate) }}
              </span>
            </v-sheet>
          </div>
          <v-sheet rounded class="image-field-container">
            <span class="image-field-container__label">
              Prompt:
            </span>
            <span class="qw-tracking-wide qw-text-xs">
              {{ imageToShow.prompt }}
            </span>
          </v-sheet>
          <v-sheet rounded class="image-field-container">
            <span class="image-field-container__label">
              Negative Prompt:
            </span>
            <span class="qw-tracking-wide qw-text-xs">
              {{ imageToShow.negativePrompt }}
            </span>
          </v-sheet>
        </div>
      </template>
    </v-toolbar>
  </ImageCard>
</template>
<script setup lang="ts">
import ImageCard from './ImageCard.vue';
import { Vote } from '~~/composables/useVotesGallery';
import { modelHashesMap } from '~~/constants';
import { ImageObject } from '~~/types';

const displayingInfo = ref(false);
const apiBaseURL = getApiBaseURL();

const clipboardStore = useClipboardStore();
const generateStore = useGenerateStore();

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

const sendImageInfoToVClip = (image?: ImageObject) => {
  if (!image) return;
  clipboardStore.addImage(image);
};
const sendToGenerate = (image?: ImageObject) => {
  if (!image) return;
  generateStore.sendToGenerate(image);
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

const imageCard = ref<InstanceType<typeof ImageCard>>();

const showInFullscreen = () => {
  imageCard.value?.goFullscreen();
}

const formatTimeToGenerate = (timeToGenerate: number) => {
  const timeInSeconds = (timeToGenerate / 1000);
  if (timeInSeconds > 60) {
    const timeInMinutes = Math.floor(timeInSeconds / 60);
    const timeInSecondsLeft = (timeInSeconds % 60).toFixed(0);
    return `${timeInMinutes} mins ${timeInSecondsLeft} secs`;
  }
  return `${(timeInSeconds).toFixed(2)} secs`;
}

const props = defineProps<{
  vote?: Vote;
  image?: ImageObject;
  hideSendToVClip?: boolean;
}>();
</script>
<style lang="scss">
.voted-img-toolbar {
  background: linear-gradient(0deg,
      rgba(9, 9, 119, 0) 0%,
      rgba(0, 0, 0, 1) 95%) !important;

  &--detailed {
    @apply qw-h-full;

    .v-toolbar__extension {
      @apply !qw-h-[calc(100%-48px)];
      @apply qw-items-start;
    }
  }
}
.image-field-container {
  @apply qw-w-full;
  @apply qw-px-3 qw-pb-3 qw-pt-6;
  @apply qw-relative;
  @apply !qw-border-[2px] !qw-border-blue-900 !qw-bg-gray-700/35;
  @apply qw-backdrop-filter qw-backdrop-blur-2xl;
  &.image-field-container--small {
    @apply qw-pb-2 qw-pt-5;
  }
  &__label {
    @apply qw-absolute;
    @apply qw-top-[6px] qw-left-2;
    @apply qw-tracking-wider qw-select-none;
    @apply qw-text-[11px];
    @apply qw-text-blue-200;
  }
}
.image-menu-list {
  .v-list-item__prepend>.v-icon {
    margin-inline-end: 20px !important;
  }
}
</style>
