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
        <v-btn
          size="x-small"
          variant="outlined"
          icon="mdi-dots-vertical"
          @click.stop="displayingInfo = !displayingInfo"
        />
      </template>
      <v-toolbar-title>
        <div class="qw-flex qw-items-center qw-gap-4">
          <v-chip label rounded="sm" color="indigo" size="x-small">
            <span class="qw-text-white qw-flex qw-items-baseline qw-gap-[3px] !qw-text-[11px]">
              {{ imageToShow.height }} <small>px</small>
              <span class="qw-mx-[4px] qw-text-[9px]">x</span>
              {{ imageToShow.width }} <small>px</small>
            </span>
          </v-chip>
        </div>
      </v-toolbar-title>
      <template v-slot:append>
        <div class="qw-flex qw-items-center qw-gap-2">
          <v-chip label rounded="sm" color="indigo" size="small">
            <span class="qw-text-white">
              {{ modelHashesNames[imageToShow.modelHash] }}
            </span>
          </v-chip>
          <v-chip class="<md:(!qw-hidden)" label rounded="sm" color="indigo" size="small">
            <span class="qw-text-white">
              {{ imageToShow.sampler }}
            </span>
          </v-chip>
          <v-chip label rounded="sm" color="indigo" size="small">
            <span class="qw-text-white">
              {{ imageToShow.steps }} it
            </span>
          </v-chip>
          <v-progress-circular
            :size="32"
            :width="2.5"
            color="blue"
            :model-value="percentageOfMaxCfg(imageToShow.cfg)"
            :title="`${imageToShow.cfg} CFG`"
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

const modelHashesNames: Record<string, string> = Object.fromEntries(
  Object.entries(modelHashesMap).map(([key, value]) => [value, key])
);

const MAX_CFG = 20;
const percentageOfMaxCfg = (val: number) => {
  return (val / MAX_CFG) * 100;
};
const getCfgTextStyle = (val: number) => {
  const cfgNumSize = `${val}`.replace(/(\.|\,)/,'').length;
  const fontSize = cfgNumSize <= 2 ? '12px' : cfgNumSize === 3 ? '10px' : '9.5px';
  const letterSpacing = cfgNumSize >= 3 ? '-0.5px' : undefined;
  return { fontSize, letterSpacing };
};

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
</style>
