<template>
  <div class="images-search qw-flex qw-flex-col qw-gap-5 qw-px-3 qw-py-6">
    <div class="qw-text-center">
      Search {{ totalSearchResults ? `[ ${totalSearchResults} ]` : "" }}
    </div>
    <v-text-field
      v-model="searchObj.prompt"
      label="Prompt"
      class="qw-mb-3"
      variant="outlined"
      density="compact"
      hide-details
      clearable
    />
    <v-text-field
      v-model="searchObj.negativePrompt"
      label="Negative prompt"
      class="qw-mb-3"
      variant="outlined"
      density="compact"
      hide-details
      clearable
    />
    <div class="qw-flex qw-gap-4">
      <v-text-field
        v-model.number="searchObj.steps"
        label="Steps"
        class="qw-mb-3"
        variant="outlined"
        density="compact"
        hide-details
        clearable
      />
      <v-text-field
        v-model.number="searchObj.cfg"
        label="CFG"
        class="qw-mb-3"
        variant="outlined"
        density="compact"
        hide-details
        clearable
      />
    </div>
    <div class="qw-flex qw-gap-4">
      <v-text-field
        v-model.number="searchObj.width"
        label="Width"
        class="qw-mb-3"
        variant="outlined"
        density="compact"
        hide-details
        clearable
      />
      <v-text-field
        v-model.number="searchObj.height"
        label="Height"
        class="qw-mb-3"
        variant="outlined"
        density="compact"
        hide-details
        clearable
      />
    </div>
    <v-select
      v-model="searchObj.sampler"
      label="Sampler"
      class="qw-mb-3"
      variant="outlined"
      density="compact"
      theme="dark"
      hide-details
      :items="Samplers"
      clearable
      transition="scroll-y-transition"
      :menu-props="{ maxHeight: 400 }"
    />
    <v-select
      v-model="searchObj.model"
      label="Model"
      class="qw-mb-3"
      variant="outlined"
      density="compact"
      theme="dark"
      hide-details
      :items="modelsAsPairs"
      item-title="0"
      item-value="1"
      clearable
      transition="scroll-y-transition"
      :menu-props="{ maxHeight: 400 }"
    />
    <div class="qw-flex qw-gap-3 qw-items-center">
      <v-btn variant="outlined" class="qw-flex-grow" @click="emit('performSearch')">
        Filter
      </v-btn>
      <v-btn
        @click="emit('clearSearch')"
        icon
        variant="outlined"
        size="x-small"
        class="!qw-rounded-sm"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ImageSearchType } from "~~/composables/useGallery";
import { Samplers, modelHashesMap } from "~~/constants";

const emit = defineEmits<{
  (event: 'performSearch'): () => void;
  (event: 'clearSearch'): () => void;
}>();

const props = defineProps<{
  searchObj: Partial<ImageSearchType>;
  totalSearchResults: number;
}>();

const modelsAsPairs = Object.entries(modelHashesMap);
</script>