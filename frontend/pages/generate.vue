<template>
  <v-container
    class="<md:(!qw-px-2 !qw-pt-3)"
    style="background-image: unset; height: inherit"
    fluid
  >
    <v-card
      color="indigo-darken-4"
      :elevation="0"
      border="md"
      class="qw-mx-auto <sm:qw-max-w-[100%] md:qw-max-w-[1080px] 2xl:qw-max-w-[1440px]"
      theme="dark"
    >
      <div class="qw-px-5 qw-py-4">
        <div class="qw-mb-2 qw-flex qw-items-center">
          <HelpLabel class="qw-mr-auto">
            <template #default>
              The prompt is the text that the AI will use to generate the
              image.<br />
              You can be very specific or very vague.<br />
              The AI will try to generate an image that matches the prompt.<br />
            </template>
            <template #label>
              <span class="text-body-2"> Prompt </span>
            </template>
          </HelpLabel>
          <HelpLabel>
            <template #default>
              Copy the current prompt to the clipboard.<br />
            </template>
            <template #label>
              <v-btn
                prepend-icon="mdi-content-copy"
                size="x-small"
                variant="outlined"
                class="copy-btn text-caption"
              >
                Copy to clipboard
              </v-btn>
            </template>
          </HelpLabel>
        </div>
        <div class="qw-mt-3">
          <v-textarea variant="outlined" v-model="prompt" counter rows="2" />
        </div>
        <HelpLabel>
          <template #default>
            The negative prompt is the text that the AI will try to avoid when
            generating the image.<br />
            For example, if you want to generate an image of a forest and use
            "green" as negative prompt, the AI probably will try to generate a
            forest in autumn.<br />
          </template>
          <template #label>
            <span class="text-body-2"> Negative prompt </span>
          </template>
        </HelpLabel>
        <div class="qw-mt-3">
          <v-textarea variant="outlined" v-model="negativePrompt" rows="2" />
        </div>
        <div class="qw-mt-3 qw-flex <lg:qw-flex-col qw-gap-3">
          <HelpLabel>
            <template #default>
              The sampler is the algorithm that the AI will use to generate the
              image.<br />
              The "Euler a" sampler is the recommended one because it will work
              with 20-30 steps.<br />
              Another good sampler is DDIM, but may require more steps (50-100)
              to generate a refined image.<br />
            </template>
            <template #label>
              <ClientOnly>
                <v-select
                  density="comfortable"
                  label="Sampler"
                  variant="outlined"
                  :items="samplers"
                  v-model="sampler"
                  hide-details
                  transition="scroll-y-transition"
                  :menu-props="{ maxHeight: 400 }"
                />
              </ClientOnly>
            </template>
          </HelpLabel>
          <HelpLabel>
            <template #default>
              The number of steps is the number of iterations that the AI will
              use to generate the image.<br />
              The more steps, the more refined the image will be, but after a
              certain point, the image will not change much.<br />
              It's recommended to start with 20-30 steps and increase it when
              you find a good seed.<br />
            </template>
            <template #label>
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
            </template>
          </HelpLabel>
          <HelpLabel>
            <template #default>
              The CFG (Classifier-free Guidance) is the amount of importance
              that the AI will give to the prompt.<br />
              The higher the CFG, the more the AI will try to match the prompt.
              But after a point it will generate glitchy images.<br />
              The UI constrains the value to 20 at max because of this.<br />
            </template>
            <template #label>
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
            </template>
          </HelpLabel>
          <v-spacer class="<lg:qw-hidden" />
          <HelpLabel>
            <template #default>
              This will defines the width of the image that will be
              generated.<br />
              Those marked with ★ are the recommended to combine and create
              rectangular images<br />
            </template>
            <template #label>
              <ClientOnly>
                <v-select
                  density="comfortable"
                  label="Width"
                  variant="outlined"
                  :items="possibleImageSideSizes"
                  v-model="width"
                  hide-details
                  transition="scroll-y-transition"
                  :menu-props="{ maxHeight: 400 }"
                />
              </ClientOnly>
            </template>
          </HelpLabel>
          <HelpLabel>
            <template #default>
              This will defines width of the image that will be generated.<br />
              Those marked with ★ are the recommended to combine and create
              rectangular images<br />
            </template>
            <template #label>
              <ClientOnly>
                <v-select
                  density="comfortable"
                  label="Height"
                  variant="outlined"
                  :items="possibleImageSideSizes"
                  v-model="height"
                  hide-details
                  transition="scroll-y-transition"
                  :menu-props="{ maxHeight: 400 }"
                />
              </ClientOnly>
            </template>
          </HelpLabel>
        </div>
        <div class="qw-mt-8 qw-mb-3">
          <v-btn
            variant="flat"
            border
            block
            color="blue-darken-4"
            @click="generateImage"
          >
            DO IT
          </v-btn>
        </div>
        <div class="qw-my-3" v-if="imagesInQueue">
          <v-progress-linear
            :model-value="progress"
            height="16"
            color="amber"
            striped
          />
        </div>
        <div v-if="imagesInQueue">
          Next image in [ {{ eta.toFixed(2) || '0' }}s ]. Images in your queue [
          {{ imagesInQueue }} ] - Generated images: [
          {{ generatedImages.length }} ]
        </div>
        <div v-if="previewImage">
          <v-img :src="previewImage" :width="width" :height="height" rounded />
        </div>
        <div class="qw-flex qw-flex-col qw-gap-3">
          <ImageGallery :images="generatedImages" />
        </div>
      </div>
    </v-card>
  </v-container>
  <ToolbarAppend>
    <div class="qw-flex qw-gap-3 qw-items-center">
      <div v-if="imagesInQueue" class="qw-flex qw-items-center qw-gap-2">
        <span class="qw-text-xs qw-text-white">
          {{ eta.toFixed(2) || '0' }}s
        </span>
        <v-progress-circular
          :size="32"
          :width="4"
          color="amber"
          v-if="progress"
          :model-value="progress"
        >
        </v-progress-circular>
      </div>
      <div>
        <v-btn
          variant="outlined"
          size="x-small"
          icon
          @click="toggleGalleryDrawer"
        >
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </div>
    </div>
  </ToolbarAppend>
  <RightDrawerTp>
    <v-navigation-drawer
      v-model="generateDrawer"
      location="right"
      color="indigo-darken-4"
      :width="drawerWidth"
      :temporary="rightDrawerIsTemporary"
      disable-resize-watcher
    >
      <div class="qw-flex qw-flex-col qw-gap-4 qw-px-3 qw-pt-5">
        <div class="qw-flex qw-w-full qw-justify-center">
          Stable Diffusion Service [ {{ status }} ]
        </div>
        <div v-if="runningFrom" class="qw-flex qw-w-full qw-justify-center">
          {{ runningFrom }}
        </div>
        <v-btn @click="startSd" variant="outlined" block>
          <div class="qw-w-full qw-flex qw-items-center qw-gap-4 qw-justify-between">
            <v-icon>
              mdi-play
            </v-icon>
            <span>
              Start - Stable Diffusion Container
            </span>
          </div>
        </v-btn>
        <v-btn @click="stopSd" variant="outlined" block>
          <div class="qw-w-full qw-flex qw-items-center qw-gap-4 qw-justify-between">
            <v-icon>
              mdi-stop
            </v-icon>
            <span>
              Stop - Stable Diffusion Container
            </span>
          </div>
        </v-btn>
        <v-btn @click="getSdStatus" variant="outlined" block>
          <div class="qw-w-full qw-flex qw-items-center qw-gap-4 qw-justify-between">
            <v-icon>
              mdi-refresh
            </v-icon>
            <span>
              Refresh status
            </span>
          </div>
        </v-btn>
        <v-btn @click="getSdLogs" variant="outlined" block>
          <div class="qw-w-full qw-flex qw-items-center qw-gap-4 qw-justify-between">
            <v-icon>
              mdi-file-document-outline
            </v-icon>
            <span>
              Logs - Stable Diffusion Container
            </span>
          </div>
        </v-btn>
        <div v-if="logs" class="text-caption qw-max-h-[450px] qw-overflow-y-scroll qw-whitespace-pre qw-font-sans">
          {{ logs }}
        </div>
      </div>
    </v-navigation-drawer>
  </RightDrawerTp>
</template>
<script setup lang="ts">
const {
  prompt,
  negativePrompt,
  seed,
  sampler,
  steps,
  cfg,
  width,
  height,
  imagesInQueue,
  progress,
  eta,
  previewImage,
  generatedImages,
  generateImage,
  possibleImageSideSizes,
  samplers,
} = useGenerate();

const { getSdLogs, getSdStatus, startSd, stopSd, status, runningFrom, logs } = useSdConfig();

onMounted(async () => {
  await getSdStatus();
});

const layoutStore = useLayoutStore();
const { drawerWidth, rightDrawerIsTemporary } = storeToRefs(layoutStore);

const generateDrawer = ref(false);
const toggleGalleryDrawer = () => {
  generateDrawer.value = !generateDrawer.value;
};
</script>
<style lang="scss">
.copy-btn {
  .mdi.v-icon {
    font-size: 11px;
    transform: rotateY(180deg);
  }
}
</style>
