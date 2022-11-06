<template>
  <div class="mobile-layout">
    <v-app-bar :elevation="0" :color="'indigo-lighten-1'" border="b-md">
      <template v-if="showingDrawerButton" v-slot:prepend>
          <v-app-bar-nav-icon/>
      </template>
      <v-app-bar-title class="w--mx-4 w--text-center">
        AI-Image Manager
      </v-app-bar-title>
      <div v-show="showSpacer" class="app-bar-spacer">
      </div>
    </v-app-bar>
    <v-main>
      <div class="w--px-3">
        <slot/>
      </div>
    </v-main>
  </div>
</template>
<script setup lang="ts">
import { useLayoutStore } from '@/store/layout'
import { storeToRefs } from 'pinia';

const layoutStore = useLayoutStore();
const { showingDrawerButton } = storeToRefs(layoutStore);

const showSpacer = computed(() => {
  return showingDrawerButton.value;
});

const doc = ref();
onMounted(() => {
  doc.value = document.documentElement;
});
useResizeObserver(doc, useThrottleFn(
  (entries) => {
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

.v-main {
  background-color: rgb(243, 243, 230);
}

.v-app-bar {
  .app-bar-spacer {
    width: 48px;
    height: 48px;
    margin-right: 10px;
  }
}
</style>