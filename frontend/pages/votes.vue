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
            {{ voteCountsMap[tab.value as VoteType] || `${totalVotes}/${totalImages} - ${percentage}%` }}
          </span>
        </div>
      </v-tab>
    </v-tabs>
    <div class="gallery-grid" v-if="votedImages.length">
      <div v-for="vote in votedImages" :key="vote.id" :data-id="vote.image.id" class="voted-image-container" :class="getClassObject(vote)">
        <ImageVoteCard :vote="vote" />
      </div>
      <div ref="bottomEl" class="qw-absolute qw-bottom-0 qw-h-[250px] qw-w-px">
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { VoteType } from '~~/composables/useCardGame';
import { Vote } from '~~/composables/useVotesGallery';

const { votedImages, currentFilter, voteCountsMap, totalVotes, totalImages, fetchNextPage } = useVotesGallery();
const percentage = computed(() => ((totalVotes.value / totalImages.value) * 100).toFixed(2));

const tabs = [
  {
    value: 'FAVORITE',
    color: 'blue-lighten-1',
    icon: 'mdi-star',
  },
  {
    value: 'UPVOTE',
    color: 'secondary',
    icon: 'mdi-heart',
  },
  {
    value: 'TO_MODIFY',
    color: 'purple-lighten-1',
    icon: 'mdi-shimmer',
  },
  {
    value: 'DOWNVOTE',
    color: 'red',
    icon: 'mdi-window-close',
  },
  {
    value: '',
    color: 'white',
    icon: 'mdi-image-check',
  },
];

const { getDimensions } = useImageUtils();
const getClassObject = (vote: Vote) => {
  const { isTall, isWide } = getDimensions(vote.image);
  return {
    tall: isTall,
    wide: isWide,
  };
};

useHead({
  title: 'Votes',
})

const bottomEl = ref<HTMLElement>();
useIntersectionObserver(
  bottomEl,
  useThrottleFn(() => {
    fetchNextPage();
  }, 1000)
)

</script>
<style lang="scss">
.gallery-grid {
  display: grid;
  grid-gap: 6px;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  background-image: linear-gradient(to top, hsl(180deg, 63%, 25%) -15%, #000640 100%);
  margin-bottom: -6px;
  @media screen and (min-width: 915px) {
    .tall {
      grid-row-end: span 2;
    }
    .wide {
      grid-column-end: span 2;
    }
  }
}
@media screen and (max-width: 915px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>
