<template>
  <ImageCard v-if="imageToShow" :image="imageToShow" :vote-type="props.vote?.vote">
    <v-toolbar
      color="rgba(0, 0, 0, 0)"
      theme="dark"
      class="voted-img-toolbar"
      density="compact"
      @click.stop="false"
    >
      <template v-slot:prepend>
        <v-btn size="x-small" variant="outlined" icon="mdi-dots-vertical" @click.stop="displayingInfo = !displayingInfo" />
      </template>
      <v-toolbar-title>
        <div class="qw-flex qw-items-center qw-gap-4">
          <v-chip label rounded="sm" color="indigo" size="small">
            <span class="qw-text-white">
              {{ imageToShow.height }} <small>px</small> <span class="qw-mx-2"><small>x</small></span> {{ imageToShow.width }} <small>px</small>
            </span>
          </v-chip>
        </div>
      </v-toolbar-title>
      <template v-slot:append>
        <div class="qw-flex qw-items-center qw-gap-2">
          <v-chip label rounded="sm" color="indigo" size="small">
            <span class="qw-text-white">
              {{ imageToShow.model || modelHashesNames[imageToShow.modelHash] }}
            </span>
          </v-chip>
          <v-chip label rounded="sm" color="indigo" size="small">
            <span class="qw-text-white">
              {{ imageToShow.sampler }}
            </span>
          </v-chip>
          <v-progress-circular
            :size="32"
            :width="2.5"
            color="blue"
            :model-value="percentageOfMaxSteps(imageToShow.steps)"
            :title="`${imageToShow.steps} steps`"
          >
            <span class="qw-text-xs qw-text-white">
              {{ imageToShow.steps }}
            </span>
          </v-progress-circular>
        </div>
      </template>
    </v-toolbar>
    <div v-if="displayingInfo" class="qw-h-[calc(100%-48px)] qw-grid qw-place-items-center qw-bg-gradient-to-b qw-from-red-200 qw-to-blue-400 qw-whitespace-pre-line">
      {{ JSON.stringify(imageToShow, null, 2) }}
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
)

const MAX_STEPS = 300;
const percentageOfMaxSteps = (val: number) => {
  return (val / MAX_STEPS) * 100;
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
  background: linear-gradient(0deg, rgba(9, 9, 119, 0) 0%, rgba(0, 0, 0, 1) 95%) !important;
}
</style>