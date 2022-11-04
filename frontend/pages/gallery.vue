<template>
  <div>
    Hi I'm your gallery 🤺
  </div>
</template>
<script lang="ts" setup>
const { data } = await useFetch('http://localhost:3000/images?page=1&size=20')
console.log({data});
</script>