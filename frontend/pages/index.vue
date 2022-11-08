<template>
  <v-theme-provider theme="dark" with-background class="login-page">
    <div class="login-form">
      <div class="text-h6 qq--text-center qq--mb-5">
        Login
      </div>
      <form @submit.prevent="handleLogin">
        <v-text-field
          v-model="email"
          type="text"
          class="qq--mb-3"
          name="email"
          label="Email"
          :disabled="loading"
          variant="outlined"
        />
        <v-text-field
          v-model="password"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          class="qq--mb-3"
          name="password"
          label="Password"
          variant="outlined"
          hint="At least 8 characters"
          counter
          :disabled="loading"
          @click:append-inner="showPassword = !showPassword"
        />
        <v-btn type="submit" variant="outlined" block size="large" class="qq--my-3" :loading="loading">
          Login
        </v-btn>
      </form>
    </div>
  </v-theme-provider>
</template>
<script lang="ts" setup>
import { apiBaseURL } from "~~/constants";
import { ImageObject } from "~~/types";

const router = useRouter();
const authStore = useAuthStore();

const layoutStore = useLayoutStore();
const { backgroundCover } = storeToRefs(layoutStore);

const email = ref("");
const password = ref("mypassucu");

const showPassword = ref(false);
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  const loginInfo = await authStore.login(email.value, password.value);
  console.log('Login info: ', loginInfo.value);
  router.push("/gallery");
  loading.value = false;
};

const { data: randomCovers } = await useAsyncData<ImageObject[]>('initial-login-cover-fetch', () => $fetch('/api/images/random-cover', { baseURL: apiBaseURL }))
backgroundCover.value = randomCovers?.value?.[0].id || '';

onUnmounted(() => {
  backgroundCover.value = '';
});
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
