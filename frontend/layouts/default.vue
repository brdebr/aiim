<template>
  <div class="layout-container mobile-layout">
    <v-app-bar :elevation="0" :color="'indigo-darken-4'" border="t-md b-md s-lg e-lg" density="compact">
      <v-app-bar-title class="qw-mx-4 qw-text-center">
        <div class="qw-select-none" @click="$router.push('/')">
          AI-Image Manager
        </div>
      </v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer
      v-if="false"
      temporary
    >
      <v-list>
      </v-list>
    </v-navigation-drawer>
    <v-main>
        <slot/>
    </v-main>
    <v-bottom-navigation
      class="bottom-bar"
      mode="shift"
      :elevation="0"
      density="comfortable"
      border="t-md b-md s-lg e-lg"
      bg-color="indigo-darken-4"
      grow hide-on-scroll
    >
      <v-btn v-for="item in bottomNavigationItems" :to="item.route" :key="item.route" :value="item.route">
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

const layoutStore = useLayoutStore();
const { bottomNavigationItems } = storeToRefs(layoutStore);

</script>
<style lang="scss">
:root {
 --doc-height: 100vh;
}
html, body, .__nuxt, .v-application {
  @apply qw-h-[calc(100vh-104px)] sm:qw-h-[calc(100vh-48px)];
  width: 100vw;
}
.v-application__wrap {
  min-height: unset !important;
}
.mobile-layout, .v-main > div {
  height: 100%;
  width: 100%;
}

// Fix these first rendering with a lower width
.v-toolbar, .v-bottom-navigation {
  width: 100%;
}

.mobile-layout {
  background-image: linear-gradient(to top, hsl(180deg 63% 25%) -15%, #000640 100%);
}

.v-app-bar {
  .app-bar-spacer {
    min-width: 48px;
    margin-right: 10px;
  }
}

// Add a little more separation between the selected item and the text from the v-bottom-navigation
.bottom-bar {
 .v-bottom-navigation__content {
  .v-btn.v-btn--active {
    .v-btn__content {
      gap: 3px;
    }
  }
 }
}
</style>