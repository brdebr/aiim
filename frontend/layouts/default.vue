<template>
  <div class="mobile-layout">
    <v-app-bar :elevation="0" :color="'indigo-lighten-1'" border="b-md">
      <template v-slot:prepend>
          <v-app-bar-nav-icon/>
      </template>
      <v-app-bar-title>
        AI-Image Manager
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <div class="w--px-3">
        <slot/>
      </div>
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

.v-main {
  background-color: rgb(243, 243, 230);
}
</style>