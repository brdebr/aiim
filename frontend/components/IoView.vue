<template>
  <div class="io-view" :class="classObject">
    <v-img
      ref="imageEl"
      :data-image-loaded="isLoaded ? true : null"
      :data-width="props.image.width"
      :data-height="props.image.height"
      :data-image-id="props.image.id"
      :src="`${apiBaseURL}/api/images/view/${props.image.id}.png`"
      :title="props.image.prompt"
      :alt="props.image.prompt"
      @click="toggleFullscreen"
      @load="isLoaded = true"
    />
  </div>
</template>
<script lang="ts" setup>
import { ImageObject } from '~~/types';
import { VImg } from 'vuetify/components';

const apiBaseURL = getApiBaseURL();
const props = defineProps<{
  image: ImageObject;
}>();

const { isTall, isWide } = getImageDimensions(props.image);

const imageEl = ref<VImg>();
const isLoaded = ref(false);
watch(props.image, () => {
  isLoaded.value = false;
});

const isFullscreen = ref(false);
const goFullscreen = () => {
  imageEl.value?.image?.requestFullscreen();
  isFullscreen.value = true;
};
const exitFullscreen = () => {
  document.exitFullscreen();
  isFullscreen.value = false;
};
const toggleFullscreen = () => {
  if (isFullscreen.value) {
    exitFullscreen();
  } else {
    goFullscreen();
  }
};

const classObject = computed(() => {
  return {
    'io-view--tall': isTall,
    'io-view--wide': isWide,
  };
});

</script>
<style lang="scss">
.io-view {
  img {
    object-fit: contain;
  }
}
</style>
