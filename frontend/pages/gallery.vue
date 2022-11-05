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
    <div class="gallery-grid">
      <img
        v-for="image in images" :key="image.id"
        :data-width="image.width" :data-height="image.height"
        :src="`http://localhost:3005/api/images/${image.id}`"
        loading="lazy"
        :title="image.prompt" :alt="image.prompt"
      />
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

const { data: imagesCount } = await useFetch<number>('http://localhost:3005/api/images/total');

const pageId = ref('');
const pageNumber = ref(1);
const pageSize = ref(15);
const cursorsHistory = ref<string[]>([]);
const amountOfPages = computed(() => imagesCount.value ? Math.ceil(imagesCount.value / pageSize.value) : 0);

const { data: images, refresh, pending: imagesPending } = await useFetch<ImageObjectsPageResponse>(() => {
  const query = new URLSearchParams({
    page: pageId.value,
    size: pageId.value ? pageSize.value.toString() : (pageSize.value + 10).toString(),
  });
  return `http://localhost:3005/api/images?${query.toString()}`;
});

const fetchNext = async () => {
  if (!images.value || images.value.length < pageSize.value) {
    return;
  }
  cursorsHistory.value.push(pageId.value);
  pageId.value = images.value[images.value.length - 1].id;
  pageNumber.value ++;
};
const fetchPrevious = async () => {
  if (pageNumber.value === 1 || !images.value) {
    return;
  }
  const previousCursor = `${cursorsHistory.value.pop()}`;
  pageId.value = previousCursor;
  pageNumber.value --;
};
</script>
<style lang="scss">
.gallery-grid {
  display: grid;
  grid-gap: 4px;
  grid-template-columns: repeat(auto-fill, minmax(375px, 1fr));
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
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