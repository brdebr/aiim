<template>
  <v-theme-provider theme="dark" with-background class="login-page">
    <div class="login-form">
      <div class="text-h6 qq--text-center qq--mb-5">
        Login
      </div>
      <v-text-field
        v-model="email"
        type="text"
        name="email"
        label="Email"
        variant="outlined"
      />
      <v-text-field
        v-model="password"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPassword ? 'text' : 'password'"
        name="password"
        label="Password"
        variant="outlined"
        hint="At least 8 characters"
        counter
        @click:append="showPassword = !showPassword"
      />
      <v-btn variant="outlined" block size="large" class="qq--my-3">
        Login
      </v-btn>
    </div>
  </v-theme-provider>
</template>
<script lang="ts" setup>
import { useLayoutStore } from "@/store/layout";
import { storeToRefs } from "pinia";
import { apiBaseURL } from "~~/constants";
import { ImageObject } from "./gallery.vue";

const email = ref("");
const password = ref("");
const showPassword = ref(false);

const { data: randomCovers } = useFetch<ImageObject[]>('/api/images/random-cover', { baseURL: apiBaseURL });

const layoutStore = useLayoutStore();
const { showingDrawerButton, backgroundCover } = storeToRefs(layoutStore);
watch(randomCovers, (newVal) => {
  if (newVal) {
    backgroundCover.value = newVal?.[0].id;
  }
}, { immediate: true });

const toggleDrawer = () => {
  showingDrawerButton.value = !showingDrawerButton.value;
};
</script>
<style lang="scss">
.login-page {
  display: grid;
  place-items: center;
  height: 100%;
  width: 100%;
  @apply qq--pb-[85px] qq--px-3;
  background: unset !important;
}
.login-form {
  background-color: rgba(34, 93, 165, 0.493);
  @apply qq--w-full qq--max-w-[500px];
  @apply qq--flex qq--flex-col qq--justify-center qq--gap-3;

  @apply qq--pt-6 qq--pb-4 qq--px-5 qq--rounded-md;

  @apply qq--backdrop-filter qq--backdrop-blur-xl;
}
</style>
