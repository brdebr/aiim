<template>
  <div>
    <h1>
      Hi I'm your gallery - {{ totalImages }} images
    </h1>
    <div class="gallery-grid">
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
          @click="vote(image)"
        />
      </div>
      <InfiniteLoading :distance="650" @infinite="fetchMoreImages" />
    </div>
  </div>
</template>
<script lang="ts" setup>
// @ts-expect-error - The component is not typed
import InfiniteLoading from 'v3-infinite-loading';
import 'v3-infinite-loading/lib/style.css'
import { apiBaseURL } from '~~/constants';
import { ImageObject } from '~~/types';

type ImageObjectsPageResponse = ImageObject[]

// API
const router = useRouter();
const pageId = ref(router.currentRoute.value.query.page as string || '');
const pageSize = ref(25);

const authStore = useAuthStore();
const { authHeader } = storeToRefs(authStore);

// Fetching
const { data: currentImagesFetched, refresh: refreshCurrentImages, pending: imagesPending } = await useFetch<ImageObjectsPageResponse>(() => {
  const query = new URLSearchParams({
    page: pageId.value,
    size: pageId.value ? pageSize.value.toString() : (pageSize.value + 35).toString(),
  });
  const endpoint = `/api/images?${query.toString()}`;
  console.log(`Fetching images -> ${endpoint}`);

  return endpoint;
}, {
  baseURL: apiBaseURL,
  headers: authHeader.value,
});
const { data: votedImageIds, refresh: refreshVoted } = await useFetch<string[]>(() => {
  const endpoint = `/api/vote/voted-image-ids`;
  console.log(`Fetching voted image ids -> ${endpoint}`);
  return endpoint;
}, {
  baseURL: apiBaseURL,
  headers: authHeader.value,
});

const totalImages = ref('');

onMounted(async () => {
  totalImages.value = await $fetch('/api/images/total',{
    baseURL: apiBaseURL,
    headers: authHeader.value,
  });
});

const vote = async (image: ImageObject) => {
  console.log(`Voting for ${image.id}`);
  await $fetch(`${apiBaseURL}/api/vote/${image.id}`, {
    method: 'POST',
    headers: authHeader.value,
  });
  votedImageIds.value?.push(image.id);
}
const isVoted = (id: string) => {
  return votedImageIds.value?.includes(id);
}

// Infinite loading
const allImages = ref<ImageObject[]>(currentImagesFetched.value || []);
watch(currentImagesFetched, (newFetchedImages) => {
  if (!newFetchedImages) {
    return
  }
  if (!router.currentRoute.value.query.page) {
    allImages.value = newFetchedImages;
    return;
  }
  allImages.value = allImages.value.concat(newFetchedImages);
});
const fetchMoreImages = async ($state: { loaded: () => void; }) => {
  if (!currentImagesFetched.value) {
    return;
  }
  const lastImage = currentImagesFetched.value[currentImagesFetched.value.length - 1];
  pageId.value = lastImage.id;
  router.push({
    query: {
      page: lastImage.id,
    },
  });

  $state?.loaded();
};
const refreshFirstPage = async () => {
  pageId.value = '';
}
onMounted(() => {
  refreshFirstPage();
  refreshVoted();
});

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