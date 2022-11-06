<template>
  <div class="mobile-layout">
    <v-app-bar :elevation="0" :color="'indigo-lighten-1'" border="b-md">
      <template v-if="showingDrawerButton" v-slot:prepend>
          <v-app-bar-nav-icon/>
      </template>
      <v-app-bar-title class="qq--mx-4 qq--text-center qq--select-none">
        AI-Image Manager
      </v-app-bar-title>
      <div v-show="showSpacer" class="app-bar-spacer">
      </div>
    </v-app-bar>
    <v-main>
      <div class="qq--px-3">
        <slot/>
      </div>
    </v-main>
  </div>
</template>
<script setup lang="ts">
import { useLayoutStore } from '@/store/layout'
import { storeToRefs } from 'pinia';
import { apiBaseURL } from '~~/constants';

const layoutStore = useLayoutStore();
const { showingDrawerButton, backgroundCover } = storeToRefs(layoutStore);
const backgroundStyle = computed(() => {
  if (!backgroundCover.value) return '';
  const url = `url(${apiBaseURL}/api/images/${backgroundCover.value})`
  return url
});

const showSpacer = computed(() => {
  return showingDrawerButton.value;
});

const doc = ref();
onMounted(() => {
  doc.value = document.documentElement;
});
useResizeObserver(doc, useThrottleFn(
  () => {
    doc.value?.style.setProperty('--doc-height', `${window.innerHeight}px`)
  }, 100)
);

</script>
<style lang="scss">
:root {
 --doc-height: 100vh;
}
html, body, .__nuxt, .v-application {
  height: 100vh;
  height: var(--doc-height);
  width: 100vw;
}
.v-application__wrap {
  min-height: unset !important;
}
.mobile-layout, .v-main, .v-main > div {
  height: 100%;
  width: 100%;
}

.v-toolbar {
  width: 100%;
}

.v-main {
  background-color: rgb(243, 243, 230);

  background-image: v-bind(backgroundStyle);
  background-size: cover;
  background-position: center;
}

.v-app-bar {
  .app-bar-spacer {
    width: 48px;
    height: 48px;
    margin-right: 10px;
  }
}
</style>