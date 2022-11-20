<template>
  <div class="io-view">
    <img
      ref="imageEl"
      :data-width="props.image.width" :data-height="props.image.height"
      :data-id="props.image.id"
      :src="`${apiBaseURL}/api/images/view/${props.image.id}`"
      loading="lazy"
      :title="props.image.prompt" :alt="props.image.prompt"
      @click="toggle"
    />
  </div>
</template>
<script lang="ts" setup>
import { ImageObject } from '~~/types';
const { getDimensions } = useImageUtils();
const apiBaseURL = useApiBaseURL();
const props = defineProps<{
  image: ImageObject;
}>();

const imageEl = ref<HTMLImageElement | null>(null);

const { toggle } = useFullscreen(imageEl);

const { isTall, isWide } = getDimensions(props.image);
</script>
<style lang="scss">
.io-view {
  img {
    object-fit: contain;
  }
}
</style>