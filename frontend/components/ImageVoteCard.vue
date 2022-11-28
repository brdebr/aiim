<template>
  <ImageCard :image="props.vote.image" :vote-type="props.vote.vote">
    <v-toolbar
      color="rgba(0, 0, 0, 0)"
      theme="dark"
      class="voted-img-toolbar"
      density="compact"
    >
      <template v-slot:prepend>
        <v-btn size="x-small" icon="mdi-dots-vertical" />
      </template>
      <v-toolbar-title class="text-body-2">
          {{ props.vote.image.height }} x {{ props.vote.image.width }}
      </v-toolbar-title>
      <template v-slot:append>
        <v-btn size="small" class="qw-pointer-events-none" :color="mapVoteTypeToColor(props.vote.vote)" :icon="mapVoteTypeToIcon(props.vote.vote)"></v-btn>
      </template>
    </v-toolbar>
  </ImageCard>
</template>
<script setup lang="ts">
import { VoteType } from '~~/composables/useCardGame';
import { Vote } from '~~/composables/useVotesGallery';


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

const props = defineProps<{
  vote: Vote;
}>();
</script>
<style lang="scss">
.voted-img-toolbar {
  background: linear-gradient(0deg, rgba(9, 9, 119, 0) 0%, rgba(0, 0, 0, 1) 100%) !important;
}
</style>