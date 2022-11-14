<template>
  <div class="layout-container mobile-layout">
    <v-app-bar :elevation="0" :color="'indigo-darken-4'" border="t-md b-md s-lg e-lg" density="compact">
      <v-app-bar-title class="qw-mx-4 qw-text-center">
        <div class="qw-select-none">
          AI-Image Manager
        </div>
      </v-app-bar-title>
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
    <v-bottom-navigation mode="shift" :elevation="0" density="comfortable" border="t-md b-md s-lg e-lg" bg-color="indigo-darken-4" grow hide-on-scroll>
      <v-btn v-for="item in bottomItems" :to="item.route" :key="item.route" :value="item.route">
        <v-icon>
          {{ item.icon }}
        </v-icon>
        <span class="!qw-text-[10px]">
          {{ item.label }}
        </span>
      </v-btn>
    </v-bottom-navigation>
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


const bottomItems = [
  {
    label: 'Card game',
    icon: 'mdi-cards-outline',
    route: '/play'
  },
  {
    label: 'Gallery',
    icon: 'mdi-image-search',
    route: '/gallery'
  },
  {
    label: 'Generate',
    icon: 'mdi-brain',
    route: '/generate'
  },
  {
    label: 'Extras',
    icon: 'mdi-shimmer',
    route: '/extras'
  },
  {
    label: 'Profile',
    icon: 'mdi-account',
    route: '/profile'
  },
]

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