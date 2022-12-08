<template>
  <v-card rounded="lg">
    <v-img
      ref="imageEl"
      :alt="props.image.prompt"
      :title="props.image.prompt"
      :src="`${apiBaseURL}/api/images/view/${props.image.id}`"
      :aspect-ratio="props.image.width / props.image.height"
      @click="toggleFullscreen"
    >
      <slot />
    </v-img>
  </v-card>
</template>
<script setup lang="ts">
import { VImg } from 'vuetify/components';
import { ImageObject } from '~~/types';

const apiBaseURL = getApiBaseURL();

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

const imageEl = ref<VImg>();

const props = defineProps<{
  image: ImageObject;
}>();
</script>
