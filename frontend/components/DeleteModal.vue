<template>
  <v-dialog v-model="dialogIsOpen" max-width="450px" max-height="750px" transition="slide-y-transition">
    <template #activator="{ props }">
      <v-list-item v-bind="props">
        <template #prepend>
          <v-icon size="small">
            mdi-delete
          </v-icon>
        </template>
        <v-list-item-title class="!qw-text-sm">
          Delete image
        </v-list-item-title>
      </v-list-item>
    </template>
    <template #default>
      <v-card :persistent="loading" border="md" class="delete-modal-card">
        <v-card-title class="!qw-py-3">
          Delete image ?
        </v-card-title>
        <v-divider class="!qw-border-indigo-900" />
        <v-card-text class="!qw-py-6">
          <div class="qw-pb-6">
           Are you sure you want to delete this image ?
          </div>
          <div>
            <ImageCard max-height="500px" :image="props.image" />
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="qw-justify-end qw-gap-2 !qw-py-[10px] !qw-px-3">
          <v-btn :disabled="loading" :loading="loading" class="!qw-px-3" variant="tonal" @click="dialogIsOpen = false">
            Close Dialog
          </v-btn>
          <v-btn :disabled="loading" :loading="loading" class="!qw-px-3" color="error" variant="tonal" @click="confirmDelete">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { ImageObject } from '~~/types';

const dialogIsOpen = ref(false);
const galleryStore = useGalleryStore();
const loading = ref(false);

const confirmDelete = async () => {
  loading.value = true;
  await galleryStore.removeImage(props.image, async () => {
    loading.value = false;
    dialogIsOpen.value = false;
    await nextTick();
  });
};

const props = defineProps<{
  image: ImageObject;
}>();

</script>
<style lang="scss">
.delete-modal-card {
  @apply !qw-border-indigo-900;
}
.v-overlay__scrim {
  @apply !qw-opacity-100 !qw-bg-indigo-800/15;
  @apply qw-backdrop-filter qw-backdrop-blur-lg;
  &.fade-transition-leave-to {
    @apply qw-backdrop-blur-0;
    @apply !qw-opacity-0;
  }
  &.fade-transition-enter-from {
    @apply qw-backdrop-blur-0;
    @apply !qw-opacity-0;
  }
}
</style>
