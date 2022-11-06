<template>
  <div class="mobile-layout w--px-3">
    <v-app-bar :elevation="0" :color="'indigo-lighten-1'" border>
      <template v-slot:prepend>
          <v-app-bar-nav-icon/>
      </template>
      <v-app-bar-title>
        AI-Image Manager
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <slot/>
    </v-main>
  </div>
</template>
<style lang="scss">
html, body, .__nuxt, .v-application {
  height: 100vh;
  width: 100vw;
}
.mobile-layout, .v-main {
  height: 100%;
  width: 100%;
}
</style>