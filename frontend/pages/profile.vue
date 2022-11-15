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
</template>
<script lang="ts" setup>

const authStore = useAuthStore();
const { loginInfo } = storeToRefs(authStore);
</script>