<template>
  <div class="gallery-page qw-px-1 qw-pt-4 sm:(qw-px-3)">
    <ImageGallery :images="allImages" @more="fetchMoreImages" />
  </div>
  <ToolbarAppend>
    <div class="qw-flex qw-gap-3 qw-items-center">
      <div>
        <v-btn variant="outlined" size="x-small" icon @click="refresh">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </div>
      <div>
        <v-btn
          variant="outlined"
          size="x-small"
          icon
          @click="toggleGalleryDrawer"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </div>
    </div>
  </ToolbarAppend>
  <RightDrawerTp>
    <v-navigation-drawer
      v-model="galleryDrawer"
      location="right"
      color="indigo-darken-4"
      :width="drawerWidth"
      :temporary="rightDrawerIsTemporary"
      disable-resize-watcher
    >
      <ImagesSearch
        :search-obj="searchObj"
        :total-search-results="totalSearchResults"
        @perform-search="performSearch"
        @clear-search="clearSearch"
      />
    </v-navigation-drawer>
  </RightDrawerTp>
</template>
<script lang="ts" setup>
useHead({
  title: 'Gallery',
});

const layoutStore = useLayoutStore();
const { drawerWidth, rightDrawerIsTemporary } = storeToRefs(layoutStore);

const galleryDrawer = ref(false);
const toggleGalleryDrawer = () => {
  galleryDrawer.value = !galleryDrawer.value;
};

const {
  allImages,
  searchObj,
  totalSearchResults,
  performSearch,
  performSearchNextPage,
  clearSearch,
  refresh,
  fetchNextImages,
  foundImages,
} = await useGallery();


const fetchMoreImages = async () => {
  foundImages.value ? await performSearchNextPage() : await fetchNextImages();
};
</script>
