<template>
  <div class="io-view">
    <img
      :data-width="props.image.width" :data-height="props.image.height"
      :data-id="props.image.id"
      :src="`${apiBaseURL}/api/images/view/${props.image.id}`"
      loading="lazy"
      :title="props.image.prompt" :alt="props.image.prompt"
    />
  </div>
</template>
<script lang="ts" setup>
import { ImageObject } from '~~/types';
const apiBaseURL = useApiBaseURL();
const props = defineProps<{
  image: ImageObject;
}>();
</script>
<style lang="scss">
.io-view {
  img {
    object-fit: contain;
  }
}
</style>