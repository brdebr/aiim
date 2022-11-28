<template>
  <ImageCard :image="props.vote.image" :vote-type="props.vote.vote">
    <v-toolbar
      color="rgba(0, 0, 0, 0)"
      theme="dark"
      class="voted-img-toolbar"
      density="compact"
    >
      <template v-slot:prepend>
        <v-btn size="x-small" variant="outlined" icon="mdi-dots-vertical" @click.stop="displayingInfo = !displayingInfo" />
      </template>
      <v-toolbar-title>
        <div class="qw-flex qw-items-center qw-gap-4">
          <div class="text-body-2">
            {{ props.vote.image.height }} x {{ props.vote.image.width }}
          </div>
        </div>
      </v-toolbar-title>
      <template v-slot:append>
        <!-- <v-btn size="small" class="qw-pointer-events-none" :color="mapVoteTypeToColor(props.vote.vote)" :icon="mapVoteTypeToIcon(props.vote.vote)"></v-btn> -->
        <v-progress-circular :size="32" color="blue" :model-value="percentageOfMaxSteps(props.vote.image.steps)" :width="2.5" :title="`${props.vote.image.steps} steps`">
            <span class="qw-text-xs qw-text-white">
              {{ props.vote.image.steps }}
            </span>
          </v-progress-circular>
      </template>
    </v-toolbar>
    <div v-if="displayingInfo" class="qw-h-[calc(100%-48px)] qw-grid qw-place-items-center qw-bg-gradient-to-b qw-from-red-200 qw-to-blue-400 qw-whitespace-pre-line">
      {{ JSON.stringify(props.vote.image, null, 2) }}
    </div>
  </ImageCard>
</template>
<script setup lang="ts">
import { VoteType } from '~~/composables/useCardGame';
import { Vote } from '~~/composables/useVotesGallery';

const displayingInfo = ref(false);

const mapVoteTypeToIcon = (type: VoteType) => {
  switch (type) {
    case VoteType.UPVOTE:
      return 'mdi-heart';
    case VoteType.FAVORITE:
      return 'mdi-star';
    case VoteType.TO_MODIFY:
      return 'mdi-shimmer';
    case VoteType.DOWNVOTE:
      return 'mdi-window-close';
    default:
      return '';
  }
};

const mapVoteTypeToColor = (type: VoteType) => {
  switch (type) {
    case VoteType.UPVOTE:
      return 'secondary';
    case VoteType.FAVORITE:
      return 'blue-lighten-1';
    case VoteType.TO_MODIFY:
      return 'purple-lighten-1';
    case VoteType.DOWNVOTE:
      return 'red';
    default:
      return '';
  }
};
const MAX_STEPS = 300;
const percentageOfMaxSteps = (val: number) => {
  return (val / MAX_STEPS) * 100;
};

const props = defineProps<{
  vote: Vote;
}>();
</script>
<style lang="scss">
.voted-img-toolbar {
  background: linear-gradient(0deg, rgba(9, 9, 119, 0) 0%, rgba(0, 0, 0, 1) 95%) !important;
}
</style>