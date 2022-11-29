<template>
  <v-container style="background-image: unset;">
    <v-card>
      <div class="qw-px-3 qw-py-3">
        <h1>
          Generate
        </h1>
        <v-divider class="qw-my-3" />
        <div class="qw-my-3">
          <v-textarea label="Prompt" variant="outlined" v-model="prompt" />
        </div>
        <div class="qw-my-3">
          <v-textarea label="Negative Prompt" variant="outlined" v-model="negativePrompt" />
        </div>
        <div class="qw-my-3">
          <v-btn :loading="loading" variant="flat" block color="primary" @click="generateImage">
            DO IT
          </v-btn>
        </div>
        <div v-if="imageSrc">
          <v-img :src="imageSrc" />
        </div>
      </div>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
useHead({
  title: 'Generate',
})

const authStore = useAuthStore();
const { fetchOptions } = storeToRefs(authStore);

const loading = ref(false)

const prompt = ref('a fluffy cat sitting on top of a table')
const negativePrompt = ref('ugly, disformed, cartoon, painting')

const imageSrc = ref('')

const generateImage = async () => {
  if(loading.value) return;

  try {
    loading.value = true
    const body = {
      prompt: prompt.value,
      negativePrompt: "ugly",
      sampler: "Euler a",
      steps: 28,
      cfg: 9,
      width: 768,
      height: 768
    }
    const imageResponseBlob = await $fetch<Blob>('/api/generate/txt2img', {
      ...fetchOptions.value,
      method: 'POST',
      body: JSON.stringify(body),
    })
    // Turn blob from response into a URL
    const imageResponseUrl = URL.createObjectURL(imageResponseBlob)
    
    // const imageParsedSrc = `data:image/jpeg;base64,${imageResponse}`
    imageSrc.value = imageResponseUrl
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false
  }
}

</script>
