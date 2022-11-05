<template>
  <div>
    <h1>Voted - {{ currentImagesFetched?.count }}</h1>
    <div class="gallery-grid" v-if="allVotedImages.length">
      <img
        v-for="image in allVotedImages" :key="image.id"
        :data-width="image.width" :data-height="image.height"
        :data-id="image.id"
        :src="`${apiBaseURL}/api/images/${image.id}`"
        loading="lazy"
        :class="getImageClass(image)"
        :title="image.prompt" :alt="image.prompt"
      />
      <!-- <InfiniteLoading :distance="650" @infinite="fetchMoreImages" /> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
// @ts-expect-error - The component is not typed
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import { apiBaseURL } from "@/constants";
import { ImageObject } from "@/pages/gallery.vue";

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
const router = useRouter();
const pageId = ref((router.currentRoute.value.query.page as string) || "");
const pageSize = ref(25);

// Fetching
const {
  data: currentImagesFetched,
  refresh,
  pending: imagesPending,
} = await useFetch<ImageObjectsPageResponse>(
  () => {
    const query = new URLSearchParams({
      id: "63668ec2570e312941a44c94",
    });
    const endpoint = `/api/vote/my-votes?${query.toString()}`;
    console.log(`Fetching voted images -> ${"63668ec2570e312941a44c94"}`);
    console.log(endpoint);

    return endpoint;
  },
  {
    baseURL: apiBaseURL,
  }
);

// const vote = async (imageId: string) => {
//   console.log(`Voting for ${imageId}`);
//   await $fetch(`${apiBaseURL}/api/vote`, {
//     method: 'POST',
//     body: JSON.stringify({ userId: '63668ec2570e312941a44c94', imageId }),
//   });
// }

// Infinite loading
const allVotedImages = ref<VoteWithImage[]>(currentImagesFetched.value?.results.map(el => {
  const { image, ...rest } = el;
  return {
    ...rest,
    ...image,
  }
}) || []);
// watch(currentImagesFetched, (newFetchedImages) => {
//   if (!newFetchedImages) {
//     return
//   }
//   allImages.value = allImages.value.concat(newFetchedImages);
// });
// const fetchMoreImages = async ($state: { loaded: () => void; }) => {
//   if (!currentImagesFetched.value) {
//     return;
//   }
//   const lastImage = currentImagesFetched.value[currentImagesFetched.value.length - 1];
//   pageId.value = lastImage.id;
//   router.push({
//     query: {
//       page: lastImage.id,
//     },
//   });

//   $state?.loaded();
// };

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
  grid-gap: 2px;
  grid-template-columns: repeat(auto-fill, minmax(325px, 1fr));
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
