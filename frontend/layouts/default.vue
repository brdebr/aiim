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
          >
            <img src="/logo-min.png" class="qw-h-6 qw-w-6" />
            <span> {{ APP_DISPLAY_NAME }} </span>
          </div>
          <!-- Toolbar Status -->
          <div v-if="imagesInQueue" class="qw-flex qw-items-center qw-gap-2">
            <span class="qw-text-xs qw-text-white">
              {{ eta.toFixed(2) || '0' }}s
            </span>
            <v-progress-circular
              :size="30"
              :width="2"
              color="amber"
              v-if="progress"
              :model-value="progress"
            >
              <span class="qw-text-xs qw-text-amber-200">
                {{ imagesInQueue }}
              </span>
            </v-progress-circular>
          </div>
          <ImagesClipboard />
          <!-- Toolbar Append -->
          <div id="toolbar-append"></div>
        </div>
      </v-app-bar-title>
    </v-app-bar>
    <!-- MAIN -->
    <v-main>
      <ClientOnly>
        <slot />
      </ClientOnly>
    </v-main>
    <!-- RIGHT DRAWER -->
    <div id="right-drawer"></div>
    <ClientOnly>
      <v-bottom-navigation
        v-if="loginInfo.id"
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
    </ClientOnly>
    <!-- BOTTOM NAV -->
  </div>
</template>
<script setup lang="ts">
import { APP_DISPLAY_NAME } from '~~/contants';

const layoutStore = useLayoutStore();
const { bottomNavigationItems } = storeToRefs(layoutStore);

const authStore = useAuthStore();
const { loginInfo } = storeToRefs(authStore);

const socketStore = useSocketStore();
const { imagesInQueue, eta, progress } = storeToRefs(socketStore);

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
  .v-toolbar-title__placeholder {
    @apply qw-overflow-visible;
  }
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
.image-clipboard-badge {
  .v-badge__badge {
    --v-badge-size: 15px;
    width: var(--v-badge-size);
    max-width: var(--v-badge-size);
    min-width: var(--v-badge-size);
    height: var(--v-badge-size);
    max-height: var(--v-badge-size);
    min-height: var(--v-badge-size);
    font-size: 9px;
    padding: 0;
    display: grid;
  }
}
.v-navigation-drawer__scrim {
  @apply qw-opacity-100;
  @apply qw-backdrop-filter qw-backdrop-blur-md;
  background: hsla(231, 100%, 50%, 0.15);
}
</style>
