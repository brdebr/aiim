<template>
  <div class="" v-if="votedImages.length">
    <v-tabs
      v-model="currentFilter"
      grow
      bg-color="primary-darken-1"
    >
      <v-tab value="UPVOTE" color="secondary">
        <v-icon start>
          mdi-heart
        </v-icon>
        <div>
          <span class="">
            {{ voteCountsMap.UPVOTE }}
          </span>
        </div>
      </v-tab>
      <v-tab value="FAVORITE" color="blue-lighten-1">
        <v-icon start>
          mdi-star
        </v-icon>
        <div>
          <span class="">
            {{ voteCountsMap.FAVORITE }}
          </span>
        </div>
      </v-tab>
      <v-tab value="TO_MODIFY" color="purple-lighten-1">
        <v-icon start>
          mdi-shimmer
        </v-icon>
        <div>
          <span class="">
            {{ voteCountsMap.TO_MODIFY }}
          </span>
        </div>
      </v-tab>
      <v-tab value="DOWNVOTE" color="red">
        <v-icon start>
          mdi-window-close
        </v-icon>
        <div>
          <span class="">
            {{ voteCountsMap.DOWNVOTE }}
          </span>
        </div>
      </v-tab>
      <v-tab value="" color="white">
        <v-icon start>
          mdi-window-close
        </v-icon>
        <div>
          <span class="">
            {{ totalVotes }}
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
        <img
          :data-width="vote.image.width" :data-height="vote.image.height"
          :src="`${apiBaseURL}/api/images/view/${vote.image.id}`"
          loading="lazy"
          :title="vote.image.prompt" :alt="vote.image.prompt"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { VoteType } from '~~/composables/useCardGame';

const { votedImages, currentFilter, voteCountsMap, totalVotes } = useVotesGallery();

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

// API
const apiBaseURL = useApiBaseURL();

</script>
<style lang="scss">
.gallery-grid {
  display: grid;
  grid-gap: 3px;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  @media screen and (min-width: 600px) {
    img.tall {
      grid-row-end: span 2;
    }
    img.wide {
      grid-column-end: span 2 / auto;
    }
  }
}
@media screen and (max-width: 500px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
.pagination {
  background-color: aquamarine;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  z-index: 1;
}
</style>
