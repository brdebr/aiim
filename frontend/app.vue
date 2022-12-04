<template>
  <v-app full-height>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </v-app>
</template>
<script lang="ts" setup>
const authStore = useAuthStore();
onMounted(() => {
  authStore.loadStorageIntoState();
})
const devTitle = import.meta.env.DEV ? 'DEV - ' : '';
useHead({
  titleTemplate:`${devTitle}%s - AI Image manager`,
  link: [
    { rel: 'icon', type: 'image/png', href: '/logo-min.png' },
 ]
})
</script>
