<template>
  <v-container style="background-image: unset">
    <v-card border="md">
      <div class="qw-px-3 qw-py-3">
        <h1>Profile</h1>
        <v-divider class="qw-my-3" />
        <div v-if="loginInfo.id">
          <v-row>
            <v-col> ID: </v-col>
            <v-col>
              {{ loginInfo.id }}
            </v-col>
          </v-row>
          <v-row>
            <v-col> Email: </v-col>
            <v-col>
              {{ loginInfo.email }}
            </v-col>
          </v-row>
          <v-row>
            <v-col> Name: </v-col>
            <v-col>
              {{ loginInfo.name }}
            </v-col>
          </v-row>
          <v-row>
            <v-col> Role: </v-col>
            <v-col>
              {{ loginInfo.role }}
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card>
  </v-container>
</template>
<script lang="ts" setup>
const authStore = useAuthStore();
const { loginInfo } = storeToRefs(authStore);
useHead({
  title: 'Profile',
});
</script>
