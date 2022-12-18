<template>
  <v-app full-height>
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
