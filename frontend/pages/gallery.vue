<template>
  <div class="gallery-page qw-px-1 qw-pt-4 sm:(qw-px-3)">
    <ImageGallery :images="allImages" @more="fetchMoreImages" />
  </div>
  <ClientOnly>
    <Teleport to="#toolbar-append">
      <div class="qw-flex qw-gap-3 qw-items-center">
        <div>
          <v-btn variant="outlined" size="x-small" icon @click="refresh">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </div>
        <div>
          <v-btn variant="outlined" size="x-small" icon @click="rightDrawerActive = !rightDrawerActive">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </div>
      </div>
    </Teleport>
    <Teleport to="#right-drawer-content">
    <div class="qw-flex qw-flex-col qw-gap-5 qw-px-3 qw-py-6">
      <div class="qw-text-center">
        Search {{totalSearchResults ? `[ ${totalSearchResults} ]` : ''}}
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
          hide-details
          :items="Samplers"
          clearable
        />
        <v-select
          v-model="searchObj.model"
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
        <v-btn variant="outlined" class="qw-flex-grow" @click="performSearch">
          Filter
        </v-btn>
        <v-btn @click="clearSearch" icon variant="outlined" size="x-small" class="!qw-rounded-sm">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
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

const scrollToTop = () => {
  window.scrollTo(0, 0);
}

const refresh = () => {
  isSearchMode.value = false;
  scrollToTop();
  router.push('/gallery');
}

const gallery = await useGallery();
const { allImages, searchObj, isSearchMode, totalSearchResults } = gallery;

const layout = useLayoutStore();
const { rightDrawerVisible, rightDrawerActive } = storeToRefs(layout);

onBeforeMount(() => {
  rightDrawerVisible.value = true;
  rightDrawerActive.value = false;
});
onUnmounted(() => {
  rightDrawerVisible.value = false;
  rightDrawerActive.value = false;
});

const btnLoading = ref(false);

const fetchMoreImages = async () => {
  btnLoading.value = true;
  if (isSearchMode.value) {
    await gallery.searchNextPage();
  } else {
    await gallery.fetchNextImages();
  }
  btnLoading.value = false;
};

const modelsAsPairs = Object.entries(modelHashesMap);

const performSearch = async () => {
  scrollToTop();
  await router.push('/gallery');
  allImages.value = await gallery.search(searchObj);
};

const clearSearch = async () => {
  searchObj.prompt = undefined;
  searchObj.negativePrompt = undefined;
  searchObj.steps = undefined;
  searchObj.cfg = undefined;
  searchObj.width = undefined;
  searchObj.height = undefined;
  searchObj.sampler = undefined;
  searchObj.model = undefined;
  isSearchMode.value = false;
  totalSearchResults.value = 0;

  await nextTick();

  scrollToTop();
  gallery.fetchInitialImages(true);
}

</script>
