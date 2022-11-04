<template>
  <div>
    <h1>
      Hi I'm your gallery 🤺
    </h1>
    <div class="pagination" v-show="!imagesPending">
      <button @click="fetchPrevious" :disabled="!images || pageNumber === 1">
        &lt; Previous
      </button>
      <div>
        Page [ {{ pageNumber }} / {{ amountOfPages }} ] - [ {{ imagesCount }} images - {{ pageSize }} per page ]
      </div>
      <button @click="fetchNext" :disabled="!images || pageNumber === amountOfPages">
        Next &gt;
      </button>
    </div>
    <div class="gallery-wip-grid">
      <div v-for="image in images" :key="image.id">
        <img :src="`http://localhost:3005/images/${image.id}`" lazy :title="image.prompt" :alt="image.prompt" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';

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

const { data: imagesCount } = await useFetch<number>('http://localhost:3005/images/total');

const page = ref('');
const pageNumber = ref(1);
const pageSize = ref(100);
const cursorsHistory = ref<string[]>([]);
const amountOfPages = computed(() => imagesCount.value ? Math.ceil(imagesCount.value / pageSize.value) : 0);

const { data: images, refresh, pending: imagesPending } = await useFetch<ImageObjectsPageResponse>(() => {
  const query = new URLSearchParams({
    page: page.value,
    size: pageSize.value.toString(),
  });
  return `http://localhost:3005/images?${query.toString()}`;
});


const fetchNext = async () => {
  if (!images.value || images.value.length < pageSize.value) {
    return;
  }
  cursorsHistory.value.push(page.value);
  page.value = images.value[pageSize.value-1].id;
  pageNumber.value ++;
};
const fetchPrevious = async () => {
  if (pageNumber.value === 1 || !images.value) {
    return;
  }
  const previousCursor = `${cursorsHistory.value.pop()}`;
  page.value = previousCursor;
  pageNumber.value --;
};
</script>
<style>
.gallery-wip-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 1rem;
}
.gallery-wip-grid img {
  width: 100%;
  height: 100%;
  object-fit: contain;
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
}
</style>