<template>
  <div class="votes-gallery-page" v-if="votedImages.length">
    <v-tabs
      v-model="currentFilter"
      grow
      bg-color="primary-darken-1"
    >
      <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value" :color="tab.color">
        <v-icon start>
          {{ tab.icon }}
        </v-icon>
        <div>
          <span class="">
            {{ voteCountsMap[tab.value] || `${totalVotes}/${totalImages} - ${percentage}%` }}
          </span>
        </div>
      </v-tab>
    </v-tabs>
    <ImageGallery :votes="votedImages" @more="fetchNextPage" />
  </div>
</template>
<script lang="ts" setup>
import { VoteType } from '~~/composables/useCardGame';

const { votedImages, currentFilter, voteCountsMap, totalVotes, totalImages, fetchNextPage } = useVotesGallery();
const percentage = computed(() => ((totalVotes.value / totalImages.value) * 100).toFixed(2));

type Tab = {
  value: VoteType;
  icon: string;
  color: string;
}

const tabs: Tab[] = [
  {
    value: VoteType.FAVORITE,
    color: 'blue-lighten-1',
    icon: 'mdi-star',
  },
  {
    value: VoteType.UPVOTE,
    color: 'secondary',
    icon: 'mdi-heart',
  },
  {
    value: VoteType.TO_MODIFY,
    color: 'purple-lighten-1',
    icon: 'mdi-shimmer',
  },
  {
    value: VoteType.DOWNVOTE,
    color: 'red',
    icon: 'mdi-window-close',
  },
  {
    value: VoteType.EMPTY,
    color: 'white',
    icon: 'mdi-image-check',
  },
];

useHead({
  title: 'Votes',
})
</script>
