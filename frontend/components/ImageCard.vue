<template>
  <v-card class="image-card" rounded="lg" border="md" :ripple="false">
    <v-img
      class="image-card__image"
      ref="imageEl"
      :alt="props.image.prompt"
      :title="props.showTitle && !isFullscreen ? props.image.prompt : null"
      :src="`${apiBaseURL}/api/images/view/${props.image.id}.png`"
      :aspect-ratio="aspectRatio"
      :style="maxHeightStyle"
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
  maxHeight?: string;
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

const { aspectRatio } = getImageDimensions(props.image);

const maxHeightStyle = computed(() => {
  if (props.maxHeight) {
    return {
      maxHeight: `${props.maxHeight} !important`,
    };
  }
  return {};
});

defineExpose({
  goFullscreen,
  exitFullscreen,
  toggleFullscreen,
});
</script>
<style lang="scss">
.v-card.image-card {
  @apply !qw-border-indigo-900;
  &__image {
    img {
      background-color: #212121;
    }
  }
  .v-responsive.v-img {
    @apply qw-bg-gradient-to-b qw-from-blue-900 qw-to-blue-gray-600;
  }
}
</style>
