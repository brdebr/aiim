<template>
  <h1>
    Profile
  </h1>
  <div v-if="loginInfo">
    <p>
      <strong>Id:</strong> {{ loginInfo.id }}
    </p>
    <p>
      <strong>Email:</strong> {{ loginInfo.email }}
    </p>
    <p>
      <strong>Name:</strong> {{ loginInfo.name }}
    </p>
    <p>
      <strong>Role:</strong> {{ loginInfo.role }}
    </p>
  </div>
  <div>
      <NuxtLink to="/">Home</NuxtLink>
      -
      <NuxtLink to="/gallery">Gallery</NuxtLink>
      -
      <NuxtLink to="/votes">Votes</NuxtLink>
    </div>
</template>
<script lang="ts" setup>

const authStore = useAuthStore();
const { loginInfo, token } = storeToRefs(authStore);
console.log(`Token for profile: ${loginInfo.value?.id}`);
console.log(token.value);
</script>