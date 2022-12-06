<template>
  <v-container style="background-image: unset;">
    <v-card>
      <div class="qw-px-3 qw-py-3">
        <h1>
          Generate
        </h1>
        <v-divider class="qw-my-3" />
        <div class="qw-my-3">
          <v-textarea label="Prompt" variant="outlined" v-model="prompt" counter rows="3" />
        </div>
        <div class="qw-my-3">
          <v-textarea label="Negative Prompt" variant="outlined" v-model="negativePrompt" rows="2" />
        </div>
        <div class="qw-my-3">
          <v-btn :loading="loading" variant="flat" block color="primary" @click="generateImage">
            DO IT
          </v-btn>
        </div>
        <div class="qw-my-3" v-if="numberInQueue">
          <v-progress-linear :model-value="progress" height="8" color="indigo-darken-3" striped />
        </div>
        <div v-if="numberInQueue">
          Next image in [ {{ eta.toFixed(2) || '0' }}s ]. Images in your queue [ {{ numberInQueue }} ] - Generated images: [ {{ generatedImages.length }} ]
        </div>
        <div class="qw-flex qw-flex-col qw-gap-3">
          <ImageGallery :images="generatedImages" />
        </div>
      </div>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { ImageObject } from '~~/types';

type ImageGenerationEvent = {
  image: ImageObject;
  queuePosition?: number;
};

useHead({
  title: 'Generate',
})

const authStore = useAuthStore();
const { fetchOptions } = storeToRefs(authStore);

const loading = ref(false)

const prompt = ref('a fluffy cat sitting on top of a table')
const negativePrompt = ref('ugly, disformed, cartoon, painting')

const numberInQueue = ref(0)

const generatedImages = ref<ImageObject[]>([])

const { eta, progress, outputProgress, outputEta } = useUserQueueSocket((generationEvent: ImageGenerationEvent) => {
  console.log('Generated Image id: ', generationEvent.image.id);
  generatedImages.value.unshift(generationEvent.image)
  numberInQueue.value = generationEvent.queuePosition || 0;
  progress.value = 0;
  eta.value = 0;
})

const generateImage = async () => {
  if(loading.value) return;

  try {
    loading.value = true
    const body = {
      prompt: prompt.value,
      negativePrompt: negativePrompt.value,
      sampler: "Euler a",
      steps: 28,
      cfg: 9,
      width: 768,
      height: 768
    }
    const response = await $fetch<{queuePosition: number}>('/api/generate/txt2img', {
      ...fetchOptions.value,
      method: 'POST',
      body: JSON.stringify(body),
    })
    numberInQueue.value = response.queuePosition
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false
  }
}

</script>
