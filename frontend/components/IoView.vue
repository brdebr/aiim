<template>
  <div class="io-view" :class="classObject">
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
const apiBaseURL = getApiBaseURL();
const props = defineProps<{
  image: ImageObject;
}>();

const imageEl = ref<HTMLImageElement | null>(null);
const { isTall, isWide } = getImageDimensions(props.image);

const classObject = computed(() => {
  return {
    'io-view--tall': isTall,
    'io-view--wide': isWide,
  };
});

const { toggle } = useFullscreen(imageEl);

</script>
<style lang="scss">
.io-view {
  img {
    object-fit: contain;
  }
}
</style>