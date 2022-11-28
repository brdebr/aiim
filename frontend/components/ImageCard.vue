<template>
  <v-card>
    <v-img
      :alt="props.image.prompt"
      :title="props.image.prompt"
      :src="`${apiBaseURL}/api/images/view/${props.image.id}`"
      :aspect-ratio="props.image.width / props.image.height"
      cover
    >
      <slot />
    </v-img>
  </v-card>
</template>
<script setup lang="ts">
import { ImageObject } from '~~/types';

const apiBaseURL = useApiBaseURL();

const props = defineProps<{
  image: ImageObject;
}>();
</script>