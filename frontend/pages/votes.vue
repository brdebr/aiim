<template>
  <div class="qw-pt-3" v-if="!imagesPending">
    <div class="gallery-grid" v-if="allVotedImages.length">
      <img
        v-for="image in allVotedImages" :key="image.id"
        :data-width="image.width" :data-height="image.height"
        :data-id="image.id"
        :src="`${apiBaseURL}/api/images/view/${image.id}`"
        loading="lazy"
        :class="getImageClass(image)"
        :title="image.prompt" :alt="image.prompt"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ImageObject } from "~~/types";

type Vote = {
  id: string;
  imageId: string;
  userId: string;
  createdAt: string;
  image: ImageObject;
}

type ImageObjectsPageResponse = {
  count: number;
  results: Vote[];
};

type VoteWithImage = Omit<Vote, "image"> & ImageObject;

// API
const authStore = useAuthStore();
const apiBaseURL = useApiBaseURL();
const { authHeader } = storeToRefs(authStore);

// Fetching
const {
  data: currentImagesFetched,
  refresh,
  pending: imagesPending,
} = await useFetch<ImageObjectsPageResponse>('/api/vote/my-votes',
  {
    baseURL: apiBaseURL,
    headers: authHeader.value
  }
);

// Infinite loading
const allVotedImages = ref<VoteWithImage[]>(currentImagesFetched.value?.results.map(el => {
  const { image, ...rest } = el;
  return {
    ...rest,
    ...image,
  }
}) || []);
watch(currentImagesFetched, (newVal) => {
  if (newVal) {
    allVotedImages.value = newVal.results.map(el => {
      const { image, ...rest } = el;
      return {
        ...rest,
        ...image,
      }
    })
  }
});

onMounted(() => {
  refresh();
});

// Image class
const getImageClass = (image: ImageObject) => {
  if (image.width / image.height < 0.85) {
    return "tall";
  }
  if (image.width / image.height > 1.15) {
    return "wide";
  }
  return "";
};
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
