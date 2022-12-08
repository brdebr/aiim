<template>
  <div class="votes-gallery-page" v-if="votedImages.length">
    <v-tabs v-model="currentVoteTypeFilter" grow bg-color="primary-darken-1">
      <v-tab
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :color="tab.color"
      >
        <v-icon start>
          {{ tab.icon }}
        </v-icon>
        <div>
          <span class="">
            {{
              voteCountsMap[tab.value]
                ? `${voteCountsMap[tab.value]} [ ${
                    percentagesMap[tab.value]
                  }% ]`
                : `${totalVotes}/${totalImages} - ${percentage}%`
            }}
          </span>
        </div>
      </v-tab>
    </v-tabs>
    <div class="qw-px-1 qw-pt-2 sm:(qw-px-3)">
      <ImageGallery :votes="votedImages" @more="fetchMoreImages" />
    </div>
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
          @click="toggleVotesDrawer"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </div>
    </div>
  </ToolbarAppend>
  <RightDrawerTp>
    <v-navigation-drawer
      v-model="votesDrawer"
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
  title: 'Votes',
});
const {
  votedImages,
  currentVoteTypeFilter,
  voteCountsMap,
  totalVotes,
  totalImages,
  fetchNextPage,
  percentagesMap,
  tabs,
  foundImages,
  refresh,
  clearSearch,
  performSearch,
  searchObj,
  totalSearchResults,
  performSearchNextPage,
} = useVotesGallery();
const percentage = computed(() =>
  ((totalVotes.value / totalImages.value) * 100).toFixed(2)
);

const layoutStore = useLayoutStore();
const { drawerWidth, rightDrawerIsTemporary } = storeToRefs(layoutStore);

const votesDrawer = ref(false);
const toggleVotesDrawer = () => {
  votesDrawer.value = !votesDrawer.value;
};

const fetchMoreImages = async () => {
  foundImages.value ? await performSearchNextPage() : await fetchNextPage();
};
</script>
