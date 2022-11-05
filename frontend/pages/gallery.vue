<template>
  <div>
    <h1>
      Hi I'm your gallery
    </h1>
    <div class="gallery-grid">
      <img
        v-for="image in allImages" :key="image.id"
        :data-width="image.width" :data-height="image.height"
        :data-id="image.id"
        :src="`${baseURL}/api/images/${image.id}`"
        loading="lazy"
        :class="getImageClass(image)"
        :title="image.prompt" :alt="image.prompt"
      />
      <InfiniteLoading :distance="850" @infinite="fetchMoreImages" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
// @ts-expect-error - The component is not typed
import InfiniteLoading from 'v3-infinite-loading';
import 'v3-infinite-loading/lib/style.css'

type ImageObject = {
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

// API
const baseURL = import.meta.env.DEV ? 'http://localhost:3005' : 'https://ai.home.bryan-web.dev';
const pageId = ref('');
const pageSize = ref(20);

// Fetching
const { data: imagesCount } = await useFetch<number>(`/api/images/total`);

const { data: currentImagesFetched, refresh, pending: imagesPending } = await useFetch<ImageObjectsPageResponse>(() => {
  const query = new URLSearchParams({
    page: pageId.value,
    size: pageId.value ? pageSize.value.toString() : (pageSize.value + 10).toString(),
  });
  console.log(`Fetching images -> ${pageId.value}`);
  console.log(`/api/images?${query.toString()}`);
  
  return `/api/images?${query.toString()}`;
}, {
  baseURL,
});

// Infinite loading
const allImages = ref<ImageObject[]>(currentImagesFetched.value || []);
watch(currentImagesFetched, (newImages) => {
  if (!newImages) {
    return
  }
  allImages.value = allImages.value.concat(newImages);
});
const fetchMoreImages = async ($state: { loaded: () => void; }) => {
  if (!currentImagesFetched.value) {
    return;
  }
  const lastImage = currentImagesFetched.value[currentImagesFetched.value.length - 1];
  pageId.value = lastImage.id;

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
  grid-gap: 4px;
  grid-template-columns: repeat(auto-fill, minmax(325px, 1fr));
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  @media screen and (min-width: 600px) {
    img.tall {
      grid-row-end: span 2 / auto;
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