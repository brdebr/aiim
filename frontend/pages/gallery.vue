<template>
  <div class="gallery-page qw-px-1 qw-pt-3 sm:(qw-px-3)">
    <ImageGallery :images="allImages" @more="fetchMoreImages" />
  </div>
</template>
<script lang="ts" setup>
const router = useRouter();
useHead({
  title: 'Gallery',
})

const gallery = await useGallery();
const { allImages } = gallery;

const btnLoading = ref(false);

const fetchMoreImages = async () => {
  btnLoading.value = true;
  const lastImageId = await gallery.fetchNextImages();
  router.push({
    query: {
      page: lastImageId
    },
    replace: true
  });
  btnLoading.value = false;
};

</script>
