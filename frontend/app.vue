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
</script>
<style lang="scss">
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-thumb {
    border-radius: 0px;
    background: hsl(239, 97%, 30%);
  &:hover {
    border-radius: 4px;
    background: hsl(239, 97%, 24%);
  }
}

::-webkit-scrollbar-track {
  background: hsla(228, 77%, 43%, 0.829);
  &:hover {
    background: hsla(229, 81%, 22%, 0.897);
  }
}
</style>