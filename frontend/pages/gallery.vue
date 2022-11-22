<template>
  <div>
    <div class="gallery-grid" v-if="allImages.length && !loadingInitialImages">
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
          :width="image.width" :height="image.height"
          :title="image.prompt" :alt="image.prompt"
        />
      </div>
      <v-btn class="load-more-btn" variant="tonal" block @click="fetchMoreImages" :loading="btnLoading">
        Load More
      </v-btn>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ImageObject } from '~~/types';

const router = useRouter();
const apiBaseURL = useApiBaseURL();
useHead({
  title: 'Gallery',
})

const gallery = await useGallery();
const { allImages, loadingInitialImages } = gallery;

const btnLoading = ref(false);

const votes = await useVotes();
const { isVoted } = votes;

const fetchMoreImages = async ($state: { loaded: () => void; }) => {
  btnLoading.value = true;
  const lastImageId = await gallery.fetchNextImages();
  router.push({
    query: {
      page: lastImageId
    },
    replace: true
  });
  btnLoading.value = false;
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
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  
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
  .load-more-btn {
    grid-column: 1/3;
  }
  
 }
 @media screen and (max-width: 500px) {
  .gallery-grid {
    grid-template-columns: 1fr;
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

.scroll-y-enter-active {
  transition: all 0.15s ease-out;
}
.scroll-y-leave-active {
  transition: all 0.15s ease-in;
}
.scroll-y-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.scroll-y-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

</style>