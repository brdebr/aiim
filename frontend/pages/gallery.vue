<template>
  <div>
    <h1>
      Hi I'm your gallery
    </h1>
    <div>
      <NuxtLink to="/">Home</NuxtLink>
      -
      <NuxtLink to="/gallery" @click="pageId=''">Gallery</NuxtLink>
      -
      <NuxtLink to="/votes">Votes</NuxtLink>
    </div>
    <div class="gallery-grid">
      <div
        v-for="image in allImages" :key="image.id"
        class="gallery-image-item"
        :class="{ 'gallery-image-item--voted': image.isVoted }"
       >
        <img
          :data-width="image.width" :data-height="image.height"
          :data-id="image.id"
          :src="`${apiBaseURL}/api/images/view/${image.id}`"
          loading="lazy"
          :class="getImageClass(image)"
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
import { apiBaseURL } from '@/constants';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~~/store/auth';

export type ImageObject = {
  id: string;
  // Prompt
  prompt: string;
  negativePrompt: string;
  // Configs
  seed: string;
  steps: number;
  sampler: string;
  cfg: number;
  width: number;
  height: number;
  // Model
  model: string;
  modelHash: string;
  // High res
  denoisingHr: number;
  firstPassHr: string;
  // Face restoration
  faceRestoration: string;
  // Metadata
  generatedAt: string;
  imageSize: string;
  timeToGenerate: number;
}
type ImageObjectsPageResponse = ImageObject[]

type ImageObjectVoted = ImageObject & {
  isVoted: boolean;
}

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
  return endpoint;
}, {
  baseURL: apiBaseURL,
  headers: authHeader.value,
});

const vote = async (image: ImageObjectVoted) => {
  console.log(`Voting for ${image.id}`);
  await $fetch(`${apiBaseURL}/api/vote/${image.id}`, {
    method: 'POST',
    headers: authHeader.value,
  });
  image.isVoted = true;
  votedImageIds.value?.push(image.id);
}

const addIsVotedProp = (images: ImageObject[]): ImageObjectVoted[] => {
  return images.map(image => {
    return {
      ...image,
      isVoted: votedImageIds.value?.includes(image.id) || false,
    }
  })
}

// Infinite loading
const allImages = ref<ImageObjectVoted[]>(addIsVotedProp(currentImagesFetched.value || []));
watch(currentImagesFetched, (newFetchedImages) => {
  if (!newFetchedImages) {
    return
  }
  if (!router.currentRoute.value.query.page) {
    allImages.value = addIsVotedProp(newFetchedImages);
    return;
  }
  allImages.value = allImages.value.concat(addIsVotedProp(newFetchedImages));
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
  await refreshCurrentImages();
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
  .gallery-image-item--voted {
    display: flex;
    position: relative;
    background-color: rgb(122, 122, 122);
    &::after {
      transition: all 0.2s;
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 2rem;
    }
    &:not(:hover)::after {
      content: '✅';
      background-color: rgba(0, 0, 0, 0.5);
    }
    img {
      margin: auto;
      width: calc(100% - 20px);
      height: calc(100% - 20px);
    }
  }

  img, .gallery-image-item {
    width: 100%;
    height: 100%;
    transition: all 0.2s;
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