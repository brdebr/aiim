<template>
  <div>
    <h1>
      Hi I'm your gallery - {{ imagesCount }} images
    </h1>
    <div class="gallery-grid" v-if="allImages.length">
      <div
        v-for="image in allImages" :key="image.id"
        class="gallery-image-item"
        :class="getImageClass(image)"
       >
        <v-icon v-if="isVoted(image.id)" icon="mdi-cards-diamond" color="#25ff11" />
        <img
          :data-width="image.width" :data-height="image.height"
          :data-id="image.id"
          :src="`${apiBaseURL}/api/images/view/${image.id}`"
          loading="lazy"
          :title="image.prompt" :alt="image.prompt"
          @click="voteImage(image)"
        />
      </div>
      <InfiniteLoading :distance="650" :firstload="false" @infinite="fetchMoreImages" />
    </div>
  </div>
</template>
<script lang="ts" setup>
// @ts-expect-error - The component is not typed
import InfiniteLoading from 'v3-infinite-loading';
import 'v3-infinite-loading/lib/style.css'
import { apiBaseURL } from '~~/constants';
import { ImageObject } from '~~/types';

const router = useRouter();

const gallery = useGallery();
const { allImages, imagesCount } = gallery;

const votes = useVotes();
const { isVoted, voteImage } = votes;

const fetchMoreImages = async ($state: { loaded: () => void; }) => {
  const lastImageId = await gallery.fetchNextImages();
  router.push({
    query: {
      page: lastImageId
    },
  });
  $state?.loaded();
};


// Image class
const getImageClass = (image: ImageObject) => {
  if (image.width / image.height < 0.85) {
    return 'tall';
  }
  if (image.width / image.height > 1.15) {
    return 'wide';
  }
  return '';
}
</script>
<style lang="scss">
.gallery-grid {
  display: grid;
  grid-gap: 3px;
  grid-template-columns: repeat(auto-fill, minmax(325px, 1fr));
  
  .gallery-image-item {
    width: 100%;
    height: 100%;
    position: relative;

    .v-icon {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 3;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      z-index: 1;
    }
  }
  
  @media screen and (min-width: 600px) {
    .gallery-image-item {
      &.tall {
        grid-row-end: span 2;
      }
      &.wide {
        grid-column-end: span 2 / auto;
      }
    }
  }
 }
</style>