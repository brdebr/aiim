<template>
  <div class="mobile-layout">
    <v-app-bar :elevation="0" :color="'indigo-lighten-1'" border="b-md t-md" density="compact">
      <template v-if="showDrawerIcon" v-slot:prepend>
          <v-app-bar-nav-icon @click="toggleDrawer"/>
      </template>
      <v-app-bar-title class="qw-mx-4 qw-text-center">
        <div class="qw-select-none">
          AI-Image Manager
        </div>
      </v-app-bar-title>
      <div v-show="showDrawerIcon" id="app-append-icon" class="app-bar-spacer">
      </div>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawerActive"
      temporary
    >
      <v-list>
        <v-list-item
          v-for="item in drawerItems"
          :key="item.label"
          :title="item.label"
          :prepend-icon="item.icon"
          :to="item.route"
          nav
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <div class="qw-px-3">
        <slot/>
      </div>
    </v-main>
  </div>
</template>
<script setup lang="ts">
import { useLayoutStore } from '@/store/layout'
import { storeToRefs } from 'pinia';
import { useApiBaseURL } from '~~/constants';

const DEFAULT_GRADIENT = 'conic-gradient(at right top, rgb(128 128 128), rgb(90 128 91), rgb(22 57 172))'

const apiBaseURL = useApiBaseURL();
const layoutStore = useLayoutStore();
const { drawerActive, backgroundCover, drawerItems } = storeToRefs(layoutStore);
const backgroundStyle = computed(() => {
  if (!backgroundCover.value) return DEFAULT_GRADIENT;
  const url = `url(${apiBaseURL}/api/images/view/${backgroundCover.value})`
  return url
});

const authStore = useAuthStore();
const { userId } = storeToRefs(authStore);

const toggleDrawer = () => {
  drawerActive.value = !drawerActive.value;
}

const showDrawerIcon = computed(() => {
  return !!userId.value;
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

  // background: conic-gradient(at right top, rgb(128 128 128), rgb(90 128 91), rgb(22 57 172));
  background: v-bind(backgroundStyle);
  background-size: cover;
  background-position: center;
}

.v-app-bar {
  .app-bar-spacer {
    min-width: 48px;
    margin-right: 10px;
  }
}
</style>