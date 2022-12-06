<template>
  <v-container class="<md:(!qw-px-2 !qw-pt-3)" style="background-image: unset; height: inherit;" fluid>
    <v-card color="indigo-darken-4" :elevation="0" border="md" class="qw-mx-auto <sm:qw-max-w-[100%] md:qw-max-w-[1080px] 2xl:qw-max-w-[1440px]" theme="dark" >
      <div class="qw-px-5 qw-py-4">
        <div class="qw-mb-2 qw-flex qw-items-center">
          <div class="qw-flex qw-items-center qw-gap-2 qw-mr-auto">
            <Help>
              The prompt is the text that the AI will use to generate the image.<br />
              You can be very specific or very vague.<br />
              The AI will try to generate an image that matches the prompt.<br />
            </Help>
            <span class="text-body-2">
              Prompt
            </span>
          </div>
          <div class="qw-flex qw-items-center qw-gap-2">
            <Help>
              Copy the current prompt to the clipboard.<br />
            </Help>
            <v-btn prepend-icon="mdi-content-copy" size="x-small" variant="outlined" class="copy-btn text-caption">
              Copy to clipboard
            </v-btn>
          </div>
        </div>
        <div class="qw-mt-3">
          <v-textarea variant="outlined" v-model="prompt" counter rows="2" />
        </div>
        <div class="qw-mb-2 qw-flex qw-items-center">
          <div class="qw-flex qw-items-center qw-gap-2 qw-mr-auto">
            <Help>
              The negative prompt is the text that the AI will try to avoid when generating the image.<br />
              For example, if you want to generate an image of a forest and use "green" as negative prompt, the AI probably will try to generate a forest in autumn.<br />
            </Help>
            <span class="text-body-2">
              Negative prompt
            </span>
          </div>
        </div>
        <div class="qw-mt-3">
          <v-textarea variant="outlined" v-model="negativePrompt" rows="2" />
        </div>
        <div class="qw-mt-3 qw-flex <lg:qw-flex-col qw-gap-3">
          <div class="qw-flex qw-items-center qw-gap-2">
            <ClientOnly>
              <Help>
                The sampler is the algorithm that the AI will use to generate the image.<br />
                The "Euler a" sampler is the recommended one because it will work with 20-30 steps.<br />
                Another good sampler is DDIM, but may require more steps (50-100) to generate a refined image.<br />
              </Help>
              <v-select
                density="comfortable"
                label="Sampler"
                variant="outlined"
                :items="Samplers"
                v-model="sampler"
                hide-details
                transition="scroll-y-transition"
                :menu-props="{ maxHeight: 400 }"
              />
            </ClientOnly>
          </div>
          <div class="qw-flex qw-items-center qw-gap-2">
            <Help>
              The number of steps is the number of iterations that the AI will use to generate the image.<br />
              The more steps, the more refined the image will be, but after a certain point, the image will not change much.<br />
              It's recommended to start with 20-30 steps and increase it when you find a good seed.<br />
            </Help>
            <v-text-field
              v-model.number="steps"
              label="Steps"
              variant="outlined"
              density="comfortable"
              type="number"
              step="1"
              max="300"
              min="1"
              hide-details
            />
          </div>
          <div class="qw-flex qw-items-center qw-gap-2">
            <Help>
              The CFG (Classifier-free Guidance) is the amount of importance that the AI will give to the prompt.<br />
              The higher the CFG, the more the AI will try to match the prompt. But after a point it will generate glitchy images.<br />
              The UI constrains the value to 20 at max because of this.<br />
            </Help>
            <ClientOnly>
              <v-slider
                v-model.number="cfg"
                class="align-center qw-w-full qw-min-w-60 lg:qw-min-w-[255px] 2xl:qw-min-w-[350px] !qw-mx-0"
                :step="0.1"
                :max="20"
                :min="1"
                color="teal-darken-3"
                track-color="teal-darken-2"
                thumb-color="indigo"
                hide-details
              >
                <template #prepend>
                  <v-text-field
                    v-model.number="cfg"
                    hide-details
                    label="CFG"
                    variant="outlined"
                    density="comfortable"
                    type="number"
                    step="0.1"
                    style="width: 90px"
                  />
                </template>
              </v-slider>
            </ClientOnly>
          </div>
          <v-spacer class="<lg:qw-hidden" />
          <div class="qw-flex qw-items-center qw-gap-2">
            <Help>
              This will defines the width of the image that will be generated.<br />
              Those marked with ★ are the recommended to combine and create rectangular images<br />
            </Help>
            <ClientOnly>
              <v-select
                density="comfortable"
                label="Width"
                variant="outlined"
                :items="possibleSizes"
                v-model="width"
                hide-details
                transition="scroll-y-transition"
                :menu-props="{ maxHeight: 400 }"
              />
            </ClientOnly>
          </div>
          <div class="qw-flex qw-items-center qw-gap-2">
            <Help>
              This will defines width of the image that will be generated.<br />
              Those marked with ★ are the recommended to combine and create rectangular images<br />
            </Help>
            <ClientOnly>
              <v-select
                density="comfortable"
                label="Height"
                variant="outlined"
                :items="possibleSizes"
                v-model="height"
                hide-details
                transition="scroll-y-transition"
                :menu-props="{ maxHeight: 400 }"
              />
            </ClientOnly>
          </div>


        </div>
        <div class="qw-mt-8 qw-mb-3">
          <v-btn :loading="loading" variant="flat" border block color="blue-darken-4" @click="generateImage">
            DO IT
          </v-btn>
        </div>
        <div class="qw-my-3" v-if="numberInQueue">
          <v-progress-linear :model-value="progress" height="16" color="amber" striped />
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
import { Samplers } from '~~/constants';
import { ImageObject } from '~~/types';

type ImageGenerationEvent = {
  image: ImageObject;
  queuePosition?: number;
};

const favoriteSizes = [512, 768, 1472, 1408, 1600, 1920]

const possibleSizes = Array.from(Array(32).keys()).map((_, i) => ({
  title: `${(i + 1) * 64}px`,
  value: (i + 1) * 64
})).filter(el => el.value >= 512).map(el => {
  if (favoriteSizes.includes(el.value)) {
    el.title = `${el.title} ★`
  }
  return el
});

useHead({
  title: 'Generate',
})

const authStore = useAuthStore();
const { fetchOptions } = storeToRefs(authStore);

const layoutStore = useLayoutStore();

const loading = ref(false)

const prompt = ref('a fluffy cat sitting on top of a table')
const negativePrompt = ref('ugly, disformed, cartoon, painting')

const seed = ref<string | null>(null)

const sampler = ref<typeof Samplers[number]>('Euler a')
const steps = ref(28)
const cfg = ref(9)
const width = ref(768)
const height = ref(768)


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
      steps: steps.value,
      cfg: cfg.value,
      width: width.value,
      height: height.value,
      seed: seed.value || undefined,
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
<style lang="scss">
.copy-btn {
  .mdi.v-icon {
    font-size: 11px;
    transform: rotateY(180deg);
  }
}
</style>
