<template>
  <v-app class="aiim-v-app">
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </v-app>
</template>
<script lang="ts" setup>
import { APP_DISPLAY_NAME } from './contants';
const devTitle = import.meta.env.DEV ? 'DEV - ' : '';
useHead({
  titleTemplate:`${devTitle}%s - ${APP_DISPLAY_NAME}`,
  link: [
    { rel: 'icon', type: 'image/png', href: '/logo-min.png' },
 ]
})
</script>
<style lang="scss">
.aiim-v-app {
  min-height: 100vh !important;
  height: auto !important;
}
</style>
