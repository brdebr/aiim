<template>
  <v-badge
    v-if="clipboard.length"
    class="image-clipboard-badge"
    color="blue-grey-darken-3"
    :content="clipboard.length"
    location="top start"
  >
    <v-dialog
      v-model="dialog"
      activator="parent"
      scrollable
      max-height="80vh"
      max-width="80vw"
      transition="scroll-y-transition"
    >
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          size="x-small"
          variant="outlined"
          icon="mdi-archive-arrow-up"
        />
      </template>
      <v-card color="indigo-darken-4" border="md" class="qw-mx-auto" min-height="80vh" min-width="80vw">
        <v-card-title>
          Virtual Clipboard
        </v-card-title>
        <v-divider class="qw-mb-4 !qw-border-indigo-700" />
        <div class="qw-flex qw-flex-col qw-gap-3 qw-px-3 qw-pb-5">
          <ImageCardDetailed v-for="image in clipboard" :key="image.id" :image="image" max-height="350px" hide-send-to-v-clip>
            <template #menu-item>
              <v-list-item @click="generateStore.sendToGenerate(image)">
                <template v-slot:prepend>
                  <v-icon size="small">
                    mdi-upload
                  </v-icon>
                </template>
                <v-list-item-title class="!qw-text-sm">
                  Send to generate
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="clipboardStore.removeImage(image)">
                <template v-slot:prepend>
                  <v-icon size="small">
                    mdi-delete
                  </v-icon>
                </template>
                <v-list-item-title class="!qw-text-sm">
                  Remove from clipboard
                </v-list-item-title>
              </v-list-item>
            </template>
          </ImageCardDetailed>
        </div>
      </v-card>
    </v-dialog>
  </v-badge>
</template>
<script setup lang="ts">
const clipboardStore = useClipboardStore();
const { clipboard } = storeToRefs(clipboardStore);

const generateStore = useGenerateStore();

const dialog = ref(false);
watch(clipboard, (newVal) => {
  if (newVal.length) {
    return;
  }
  dialog.value = false;
}, { deep: true })

</script>
