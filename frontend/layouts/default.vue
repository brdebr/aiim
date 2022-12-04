<template>
  <div class="layout-container mobile-layout">
    <v-app-bar :elevation="0" :color="'indigo-darken-4'" border="t-md b-md s-lg e-lg" density="compact">
      <v-app-bar-title class="!qw-mx-0">
        <div class="qw-mx-2 qw-flex qw-items-center qw-gap-4">
          <div class="qw-flex qw-gap-3 qw-items-center qw-select-none qw-mr-auto" @click="$router.push('/')">
            <img src="/logo-min.png" class="qw-h-6 qw-w-6"/>
            <span>
              AI Image Manager
            </span>
          </div>
          <template v-if="searchButtonsActive">
            <div class="qw-hidden sm:qw-block">
              <v-btn variant="outlined" size="x-small" icon>
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </div>
            <div class="qw-hidden sm:qw-block">
              <v-btn variant="outlined" size="x-small" icon @click="rightDrawerActive = !rightDrawerActive">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </div>
          </template>
        </div>
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <slot/>
    </v-main>
    <v-navigation-drawer
      v-if="rightDrawerVisible"
      v-model="rightDrawerActive"
      location="right"
      color="indigo-darken-4"
      :width="drawerWidth"
      temporary
    >
      <div id="right-drawer-content" class="qw-flex qw-flex-col qw-gap-5 qw-px-3 qw-py-6">
      </div>
    </v-navigation-drawer>
    <v-bottom-navigation
      v-if="userId"
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
const layoutStore = useLayoutStore();
const { bottomNavigationItems, rightDrawerActive, rightDrawerVisible, drawerWidth, searchButtonsActive } = storeToRefs(layoutStore);

const authStore = useAuthStore();
const { userId } = storeToRefs(authStore);

useHead({
  meta: [
    {
      name: 'mobile-web-app-capable',
      content: 'yes',
    },
  ],
})

</script>
<style lang="scss">
.v-application {
  @apply qw-h-[calc(100vh-104px)] sm:qw-h-[calc(100vh-var(--v-layout-bottom))];
}
.mobile-layout {
  height: 100%;
  width: 100%;
  &, .v-main > * {
    background: linear-gradient(to top, hsl(180deg 63% 25%) -15%, #000640 100%);
  }
}

// Fix these first rendering with a lower width
.v-toolbar, .v-bottom-navigation {
  width: 100%;
}
</style>
