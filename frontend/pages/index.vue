<template>
  <v-theme-provider theme="dark" with-background class="login-page" tag="div">
    <div class="login-form">
      <div class="text-h6 qw-text-center qw-mb-5">Login</div>
      <form @submit.prevent="executeLogin">
        <v-text-field
          v-model="loginEmail"
          type="text"
          class="qw-mb-3"
          name="email"
          label="Email"
          :disabled="loading"
          variant="outlined"
        />
        <v-text-field
          v-model="loginPassword"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          class="qw-mb-3"
          name="password"
          label="Password"
          variant="outlined"
          hint="At least 8 characters"
          counter
          :disabled="loading"
          @click:append-inner="showPassword = !showPassword"
        />
        <v-btn
          type="submit"
          variant="outlined"
          block
          size="large"
          class="qw-my-3"
          :loading="loading"
        >
          Login
        </v-btn>
      </form>
    </div>
  </v-theme-provider>
</template>
<script lang="ts" setup>
const showPassword = ref(false);

const { loginEmail, loginPassword, executeLogin, loading } = await useLogin();
useHead({
  title: 'Login',
});
</script>
<style lang="scss">
.login-page {
  display: grid;
  place-items: center;
  height: calc(100vh - var(--v-layout-bottom) - var(--v-layout-top)) !important;
  width: 100%;
  @apply qw-pb-[85px] qw-px-3;
}
.login-form {
  background-color: rgba(34, 93, 165, 0.493);
  @apply qw-w-full qw-max-w-[500px];
  @apply qw-flex qw-flex-col qw-justify-center qw-gap-3;

  @apply qw-pt-6 qw-pb-4 qw-px-5 qw-rounded-md;

  @apply qw-backdrop-filter qw-backdrop-blur-xl;
}
</style>
