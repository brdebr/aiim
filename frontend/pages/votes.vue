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
      <div v-for="vote in votedImages" :key="vote.id" :data-id="vote.image.id" class="qw-relative">
        <div class="qw-absolute qw-right-1 qw-top-1">
          <v-icon :color="mapVoteTypeToColor(vote.vote)">
            {{ mapVoteTypeToIcon(vote.vote) }}
          </v-icon>
        </div>
        <IoView :image="vote.image"/>
      </div>
      <div ref="bottomEl" class="qw-absolute qw-bottom-0 qw-h-[250px] qw-w-full">
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { VoteType } from '~~/composables/useCardGame';

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
  grid-gap: 3px;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  background-image: linear-gradient(to top, hsl(180deg, 63%, 25%) -15%, #000640 100%);
  margin-bottom: -6px;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  @media screen and (min-width: 600px) {
    .tall {
      grid-row-end: span 2;
    }
    .wide {
      grid-column-end: span 2 / auto;
    }
  }
}
@media screen and (max-width: 500px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>
