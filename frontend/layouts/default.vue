<template>
  <div class="mobile-layout">
    <v-app-bar :elevation="0" :color="'indigo'">
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