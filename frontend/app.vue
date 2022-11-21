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
useHead({
  link: [
    { rel: 'icon', type: 'image/png', href: '/logo-min.png' },
 ]
})
</script>
