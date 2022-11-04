<template>
  <div>
    <h1>
      Hi I'm your gallery 🤺 - {{ images.length }}
    </h1>
    <div class="pagination" v-show="!imagesPending">
      <button @click="fetchPrevious">
        &lt; Previous
      </button>
      <div>
        Page - {{ pageNumber }} / {{ amountOfPages }}
      </div>
      <button @click="fetchNext">
        Next &gt;
      </button>
    </div>
    <div class="gallery-wip-grid">
      <div v-for="image in images" :key="image.id">
        <img :src="`http://localhost:3000/images/${image.id}`" :title="image.prompt" :alt="image.prompt" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
const { data: imagesCount } = await useFetch('http://localhost:3000/images/total');

const page = ref('');
const pageNumber = ref(1);
const pageSize = ref(40);
const amountOfPages = computed(() => Math.ceil(imagesCount.value / pageSize.value));

const { data: images, refresh, pending: imagesPending } = await useFetch(() => {
  const query = new URLSearchParams({
    page: page.value,
    size: pageSize.value.toString(),
  });
  return `http://localhost:3000/images?${query.toString()}`;
});


const fetchNext = async () => {
  if (images.value.length < pageSize.value) {
    return;
  }
  page.value = images.value[pageSize.value-1].id;
  pageNumber.value ++;
};
const fetchPrevious = async () => {
  page.value = images.value[0].id;
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