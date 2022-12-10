<template>
  <div class="layout-container mobile-layout">
    <!-- TOOLBAR -->
    <v-app-bar
      :elevation="0"
      :color="'indigo-darken-4'"
      border="t-md b-md s-lg e-lg"
      density="compact"
    >
      <v-app-bar-title class="!qw-mx-0">
        <div class="qw-mx-2 qw-flex qw-items-center qw-gap-4">
          <div
            class="qw-flex qw-gap-3 qw-items-center qw-select-none qw-mr-auto qw-flex-grow"
            @click="$router.push('/')"
          >
            <img src="/logo-min.png" class="qw-h-6 qw-w-6" />
            <span> {{ APP_DISPLAY_NAME }} </span>
          </div>
          <div id="toolbar-append"></div>
        </div>
      </v-app-bar-title>
    </v-app-bar>
    <!-- MAIN -->
    <v-main>
      <slot />
    </v-main>
    <!-- RIGHT DRAWER -->
    <div id="right-drawer"></div>
    <!-- BOTTOM NAV -->
    <v-bottom-navigation
      v-if="userId"
      class="bottom-bar"
      mode="shift"
      :elevation="0"
      density="comfortable"
      border="t-md b-md s-lg e-lg"
      bg-color="indigo-darken-4"
      grow
      hide-on-scroll
    >
      <v-btn
        v-for="item in bottomNavigationItems"
        :to="item.route"
        :key="item.route"
        :value="item.route"
      >
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
import { APP_DISPLAY_NAME } from '~~/contants';

const layoutStore = useLayoutStore();
const { bottomNavigationItems } = storeToRefs(layoutStore);

const authStore = useAuthStore();
const { userId } = storeToRefs(authStore);

useHead({
  meta: [
    {
      name: 'mobile-web-app-capable',
      content: 'yes',
    },
  ],
});
</script>
<style lang="scss">
.v-application {
  @apply qw-h-[calc(100vh-104px)] sm:qw-h-[calc(100vh-var(--v-layout-bottom))];
}
.mobile-layout {
  height: 100%;
  width: 100%;
  .v-main {
    height: 100%;
  }

  &,
  .v-main > * {
    background: linear-gradient(to top, hsl(180deg 63% 25%) -15%, #000640 100%);
  }
}
</style>
