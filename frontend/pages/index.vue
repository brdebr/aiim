<template>
  <div>
    <v-btn @click="toggleDrawer">
      ola
    </v-btn>
  </div>
</template>
<script lang="ts" setup>
import { useLayoutStore } from '@/store/layout'
import { storeToRefs } from 'pinia';

const layoutStore = useLayoutStore();
const { showingDrawerButton } = storeToRefs(layoutStore);

const toggleDrawer = () => {
  showingDrawerButton.value = !showingDrawerButton.value;
}
</script>