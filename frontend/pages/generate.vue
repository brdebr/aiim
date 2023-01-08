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
      class="qw-mx-auto <sm:qw-max-w-[100%] md:qw-max-w-[1080px] 2xl:qw-max-w-[1440px] qw-mb-2"
      theme="dark"
    >
      <div class="qw-px-5 qw-py-4">
        <div class="qw-mb-2 qw-flex qw-gap-3 qw-items-center">
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
              Embeddings are a way to saving a detailed description into compressed bytes that the AI can understand.<br />
              These embeddings are created by training the AI on a dataset of images to learn the intrinsic properties of the images.<br />
              You can combine multiple embeddings in the prompt or negative prompt.<br />
            </template>
            <template #label>
              <v-menu
                transition="scroll-y-transition"
                :max-height="400"
                location="bottom end"
              >
                <template #activator="{ props }">
                  <v-btn
                    size="x-small"
                    variant="outlined"
                    class="copy-btn text-caption"
                    :disabled="!embeddings.length"
                    v-bind="props"
                  >
                    {{ embeddings.length ? `[ ${embeddings.length} ]` : '' }} Embeddings
                  </v-btn>
                </template>
                <v-list v-if="embeddings.length" class="qw-mt-1" density="compact">
                  <v-list-item
                    v-for="embedding in embeddings"
                    :key="embedding"
                    :value="embedding"
                  >
                    <v-list-item-title @click="appendEmbedding(embedding)">
                      {{ embedding }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </HelpLabel>
          <HelpLabel>
            <template #default>
              Get the image info from the clipboard and set it as the generation options.<br />
            </template>
            <template #label>
              <v-btn
                prepend-icon="mdi-content-copy"
                size="x-small"
                variant="outlined"
                class="copy-btn text-caption"
                @click="copyPromptFromClipboard"
              >
                <span class="<md:qw-hidden">
                  From clipboard
                </span>
              </v-btn>
            </template>
          </HelpLabel>
        </div>
        <div class="qw-mt-3">
          <v-textarea variant="outlined" v-model="prompt" rows="2" />
        </div>
        <div class="qw-mb-2 qw-flex qw-items-center">
          <HelpLabel class="qw-mr-auto">
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
          <HelpLabel>
            <template #default>
              This will reset the prompt configuration to the default values.<br />
            </template>
            <template #label>
              <v-btn
                prepend-icon="mdi-refresh"
                size="x-small"
                variant="outlined"
                class="copy-btn text-caption"
                @click="refreshGenerate"
              >
                Reset configs
              </v-btn>
            </template>
          </HelpLabel>
        </div>
        <div class="qw-mt-3">
          <v-textarea variant="outlined" v-model="negativePrompt" rows="2" />
        </div>
        <div class="qw-mt-3 md:qw-mb-6 qw-flex <lg:qw-flex-col qw-gap-3">
          <HelpLabel class="lg:qw-mr-1">
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
          <HelpLabel class="lg:qw-mr-9">
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
              A low value will allow the AI to be more creative, a high value will make the AI follow the prompt more closely.<br />
              After a point it will generate glitchy images.<br />
              The UI constrains the value to 20 at max because of this.<br />
            </template>
            <template #label>
              <ClientOnly>
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
        <div class="qw-mt-3 qw-flex <lg:qw-flex-col qw-gap-3">
          <HelpLabel>
            <template #default>
              The seed is the random number that the AI will use to start generating the image.<br />
              If you want to generate the same image again, you can use the same seed.<br />
              But will only generate the exact same image if you use the same configurations.<br />
              When you find a good image, you can use that seed and play with the steps to generate a more refined image.<br />
              Or do small changes to the prompt or configuration and see how the image changes.<br />
            </template>
            <template #label>
              <ClientOnly>
                <v-text-field
                  v-model="seed"
                  hide-details
                  persistent-placeholder
                  placeholder="Random seed"
                  label="Seed"
                  class="seed-input"
                  variant="outlined"
                  density="comfortable"
                  type="text"
                  :title="seed"
                  style="width: 120px"
                />
              </ClientOnly>
            </template>
          </HelpLabel>
          <HelpLabel class="lg:qw-mr-5 qw-h-12">
            <template #default>
              This option will improve the quality of the faces in the image using the CodeFormer model.<br />
              But it will take longer to generate the image because it needs to
              load and run the restoration model for each image.
            </template>
            <template #label>
              <ClientOnly>
                <v-checkbox
                  label="Fix faces"
                  variant="outlined"
                  v-model="restoreFaces"
                  hide-details
                />
              </ClientOnly>
            </template>
          </HelpLabel>
          <HelpLabel class="qw-h-12">
            <template #default>
              This option will generate images that are repeatable in a grid.<br />
              This is useful for creating textures or patterns.<br />
            </template>
            <template #label>
              <ClientOnly>
                <v-checkbox
                  label="Tiling"
                  variant="outlined"
                  v-model="tiling"
                  hide-details
                />
              </ClientOnly>
            </template>
          </HelpLabel>
          <v-spacer class="qw-hidden lg:qw-block" />
          <div class="qw-flex-grow qw-grid lg:qw-grid-cols-2 qw-gap-3 <lg:qw-mt-1 lg:qw-max-w-[331px]">
            <HelpLabel>
              <template #default>
                The number of images that will be generated at the same time.<br />
              </template>
              <template #label>
                <v-text-field
                  v-model.number="imagesPerBatch"
                  label="Images per batch"
                  variant="outlined"
                  density="comfortable"
                  type="number"
                  step="1"
                  max="16"
                  min="1"
                  hide-details
                />
              </template>
            </HelpLabel>
            <HelpLabel class="qw-inline-block">
              <template #default>
                The number of batches of images that will be generated.<br />
              </template>
              <template #label>
                <v-text-field
                  v-model.number="batchesToGenerate"
                  label="Num of batches"
                  variant="outlined"
                  density="comfortable"
                  type="number"
                  step="1"
                  max="100"
                  min="1"
                  hide-details
                />
              </template>
            </HelpLabel>
          </div>
        </div>
        <div class="qw-mt-8 qw-mb-3">
          <v-btn
            variant="flat"
            border
            block
            class="generate-btn"
            :disabled="!isSdRunning"
            color="blue-darken-4"
            @click="generateImage"
          >
            Generate [ {{ imagesPerBatch * batchesToGenerate }} ] images
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
          <div>
            Generated images: [
            {{ generatedImages.length }} ]
          </div>
        </div>
        <div v-if="previewImage">
          <v-img :src="previewImage" :width="width" :height="height" rounded />
        </div>
        <ImageGallery :images="generatedImages" one-col />
      </div>
    </v-card>
  </v-container>
  <ToolbarAppend>
    <div class="qw-flex qw-gap-3 qw-items-center">
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
      temporary
      disable-resize-watcher
      disable-route-watcher
    >
      <div class="qw-flex qw-flex-col qw-gap-4 qw-px-3 qw-pt-5">
        <div class="qw-flex qw-w-full qw-justify-center">
          SD Service [ {{ isSdLoading ? '...' : status }} ]
        </div>
        <div v-if="runningFrom" class="qw-flex qw-w-full qw-justify-center">
          {{ runningFrom }}
        </div>
        <v-btn @click="startSd" :disabled="isSdLoading" :loading="isSdLoading" variant="outlined" block>
          <div
            class="qw-w-full qw-flex qw-items-center qw-gap-4 qw-justify-between"
          >
            <v-icon> mdi-play </v-icon>
            <span> Start - SD Service </span>
          </div>
        </v-btn>
        <v-btn @click="stopSd" :disabled="isSdLoading" :loading="isSdLoading" variant="outlined" block>
          <div
            class="qw-w-full qw-flex qw-items-center qw-gap-4 qw-justify-between"
          >
            <v-icon> mdi-stop </v-icon>
            <span> Stop - SD Service </span>
          </div>
        </v-btn>
        <v-btn @click="refreshSdStatus" :disabled="isSdLoading" :loading="isSdLoading" variant="outlined" block>
          <div
            class="qw-w-full qw-flex qw-items-center qw-gap-4 qw-justify-between"
          >
            <v-icon> mdi-refresh </v-icon>
            <span> Refresh status </span>
          </div>
        </v-btn>
        <div v-if="!isSdLoading && isSdRunning" class="qw-flex qw-items-center qw-gap-2">
          <v-select
            variant="outlined"
            :items="models"
            item-title="model_name"
            item-value="title"
            label="Model"
            density="compact"
            hide-details
            theme="dark"
            :disabled="isSdLoading"
            transition="scroll-y-transition"
            :menu-props="{ maxHeight: 400 }"
            v-model="selectedModel"
          />
          <v-btn
            @click="selectModel"
            :loading="loadingModel || isSdLoading"
            :disabled="loadingModel || isSdLoading"
            variant="outlined"
          >
            <div
              class="qw-w-full qw-flex qw-items-center qw-gap-4 qw-justify-between"
            >
              <v-icon> mdi-check </v-icon>
            </div>
          </v-btn>
        </div>
        <v-btn @click="getSdLogs" :disabled="isSdLoading" variant="outlined" block>
          <div
            class="qw-w-full qw-flex qw-items-center qw-gap-4 qw-justify-between"
          >
            <v-icon> mdi-file-document-outline </v-icon>
            <span> Logs - SD Service </span>
          </div>
        </v-btn>
        <div
          v-if="logs"
          class="text-caption qw-max-h-[350px] qw-overflow-y-scroll qw-whitespace-pre qw-font-sans"
        >
          {{ logs }}
        </div>
      </div>
    </v-navigation-drawer>
  </RightDrawerTp>
</template>
<script setup lang="ts">
useHead({
  title: 'Generate',
});
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
  previewImage,
  generatedImages,
  generateImage,
  possibleImageSideSizes,
  samplers,
  refreshGenerate,
  restoreFaces,
  tiling,
  batchesToGenerate,
  imagesPerBatch,
} = useGenerate();

const {
  getSdLogs,
  startSd,
  stopSd,
  status,
  runningFrom,
  logs,
  models,
  refreshSdStatus,
  selectModel,
  selectedModel,
  loadingModel,
  loadingStopSd,
  loadingStartSd,
  embeddings
} = useSdConfig();

onMounted(() => {
  refreshSdStatus();
})

const layoutStore = useLayoutStore();
const { drawerWidth } = storeToRefs(layoutStore);

const isSdLoading = computed(() => loadingStartSd.value || loadingStopSd.value);
const isSdRunning = computed(() => status.value === 'Running');

const copyPromptFromClipboard = async () => {
  const text = await navigator.clipboard.readText();
  try {
    const imageObject = JSON.parse(text);
    console.log(imageObject);
    prompt.value = imageObject.prompt;
    negativePrompt.value = imageObject.negativePrompt;
    sampler.value = imageObject.sampler;
    steps.value = imageObject.steps;
    cfg.value = imageObject.cfg;
    width.value = imageObject.width;
    height.value = imageObject.height;
  } catch (error) {
    console.log('Failed to parse clipboard text as JSON');
    console.log('Text:', text);
    
    console.log(error);
  }
};

const appendEmbedding = (embedding: string) => {
  prompt.value += ` ${embedding}`;
}

const generateDrawer = ref(false);
const toggleGalleryDrawer = () => {
  generateDrawer.value = !generateDrawer.value;
};
</script>
<style lang="scss">
.copy-btn {
  .mdi.v-icon {
    @apply <md:-mr-[5px];
    font-size: 11px;
    transform: rotateY(180deg);
  }
}
.generate-btn {
  .v-btn__overlay {
    background-color: rgba(0, 0, 0);
  }
}
.seed-input input {
  font-size: 13px;
  padding-right: 10px;
}
.help-label-component {
  .v-checkbox {
    .v-selection-control {
      width: 100%;
      .v-label {
        margin-left: 6px;
        flex-grow: 1;
      }
    }
  }
}
</style>
