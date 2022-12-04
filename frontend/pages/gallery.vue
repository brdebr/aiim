<template>
  <div class="gallery-page qw-px-1 qw-pt-4 sm:(qw-px-3)">
    <ImageGallery :images="allImages" @more="fetchMoreImages" />
  </div>
  <ClientOnly>
    <Teleport to="#right-drawer-content">
      <div class="qw-text-center">
        Search
      </div>
      <v-text-field
        v-model="search.prompt"
        label="Prompt"
        class="qw-mb-3"
        variant="outlined"
        density="compact"
        hide-details
        clearable
      />
      <v-text-field
        v-model="search.negativePrompt"
        label="Negative prompt"
        class="qw-mb-3"
        variant="outlined"
        density="compact"
        hide-details
        clearable
      />
      <div class="qw-flex qw-gap-4">
        <v-text-field
          v-model.number="search.steps"
          label="Steps"
          class="qw-mb-3"
          variant="outlined"
          density="compact"
          hide-details
          clearable
        />
        <v-text-field
          v-model.number="search.cfg"
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
          v-model.number="search.width"
          label="Width"
          class="qw-mb-3"
          variant="outlined"
          density="compact"
          hide-details
          clearable
        />
        <v-text-field
          v-model.number="search.height"
          label="Height"
          class="qw-mb-3"
          variant="outlined"
          density="compact"
          hide-details
          clearable
        />
      </div>
        <v-select
          v-model="search.sampler"
          label="Sampler"
          class="qw-mb-3"
          variant="outlined"
          density="compact"
          hide-details
          :items="Samplers"
          clearable
        />
        <v-select
          v-model="search.model"
          label="Model"
          class="qw-mb-3"
          variant="outlined"
          density="compact"
          hide-details
          :items="modelsAsPairs"
          item-title="0"
          item-value="1"
          clearable
        />
      <div class="qw-flex qw-gap-3 qw-items-center">
        <v-btn variant="outlined" class="qw-flex-grow">
          Filter
        </v-btn>
        <v-btn @click="clearSearch" icon variant="outlined" size="x-small" class="!qw-rounded-sm">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </Teleport>
  </ClientOnly>
</template>
<script lang="ts" setup>
import { Samplers, modelHashesMap } from '~~/constants';
const router = useRouter();
useHead({
  title: 'Gallery',
})

const gallery = await useGallery();
const { allImages } = gallery;

const layout = useLayoutStore();
const { rightDrawerVisible } = storeToRefs(layout);

onBeforeMount(() => {
  rightDrawerVisible.value = true;
});
onUnmounted(() => {
  rightDrawerVisible.value = false;
});

const btnLoading = ref(false);

const fetchMoreImages = async () => {
  btnLoading.value = true;
  const lastImageId = await gallery.fetchNextImages();
  router.push({
    query: {
      page: lastImageId
    },
    replace: true
  });
  btnLoading.value = false;
};

const modelsAsPairs = Object.entries(modelHashesMap);

type ImageSearchType = {
  prompt: string;
  negativePrompt: string;
  steps: number;
  cfg: number;
  width: number;
  height: number;
  sampler: typeof Samplers[number];
  model: typeof modelsAsPairs[number][1];
}

const search = reactive<Partial<ImageSearchType>>({});

const clearSearch = () => {
  search.prompt = undefined;
  search.negativePrompt = undefined;
  search.steps = undefined;
  search.cfg = undefined;
  search.width = undefined;
  search.height = undefined;
  search.sampler = undefined;
  search.model = undefined; 
}

</script>
