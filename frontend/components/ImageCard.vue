<template>
  <v-card rounded="lg" :ripple="false">
    <v-img
      ref="imageEl"
      :alt="props.image.prompt"
      :title="props.showTitle && !isFullscreen ? props.image.prompt : null"
      :src="`${apiBaseURL}/api/images/view/${props.image.id}.png`"
      :aspect-ratio="props.image.width / props.image.height"
      @click="exitFullscreen"
    >
      <slot />
    </v-img>
  </v-card>
</template>
<script setup lang="ts">
import { VImg } from 'vuetify/components';
import { ImageObject } from '~~/types';

type ImageCardProps = {
  image: ImageObject;
  showTitle?: boolean;
};

const apiBaseURL = getApiBaseURL();

const isFullscreen = ref(false);
const goFullscreen = () => {
  imageEl.value?.image?.requestFullscreen();
  isFullscreen.value = true;
};
const exitFullscreen = async () => {
  try {
    await document?.exitFullscreen();
    isFullscreen.value = false;
  } catch (e) {
    console.log(e);
  }
};
const toggleFullscreen = () => {
  if (isFullscreen.value) {
    exitFullscreen();
  } else {
    goFullscreen();
  }
};

const imageEl = ref<VImg>();

const props = withDefaults(defineProps<ImageCardProps>(), {
  showTitle: true,
});

defineExpose({
  goFullscreen,
  exitFullscreen,
  toggleFullscreen,
});
</script>
