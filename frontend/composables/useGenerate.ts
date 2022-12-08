import { Samplers } from "~~/constants";
import { ImageObject } from "~~/types";
import { getFetchOptions } from "~~/utils/general";

export type ImageGenerationEvent = {
  image: ImageObject;
  queuePosition?: number;
};

const FAVORITE_SIZES = [512, 768, 1472, 1408, 1600, 1920];

export const POSSIBLE_IMAGE_SIZES = Array.from(Array(32).keys())
  .map((_, i) => ({
    title: `${(i + 1) * 64}px`,
    value: (i + 1) * 64,
  }))
  .filter((el) => el.value >= 512)
  .map((el) => {
    if (FAVORITE_SIZES.includes(el.value)) {
      el.title = `${el.title} ★`;
    }
    return el;
  });

const DEFAULT_PROMPT = "a fluffy cat sitting on top of a table";
const DEFAULT_NEGATIVE_PROMPT = "poorly drawn, ugly, tiling, out of frame, extra limbs, disfigured, deformed, cross-eye, body out of frame, blurry, bad art, blurred, text, watermark, grainy, writing, calligraphy, cut off, disfigured, kitsch, oversaturated, grain, low-res, disgusting, childish";

const DEFAULT_SAMPLER = "Euler a";
const DEFAULT_STEPS = 28;
const DEFAULT_CFG = 9;
const DEFAULT_WIDTH = 768;
const DEFAULT_HEIGHT = 768;

export const useGenerate = () => {

  const fetchOptions = getFetchOptions()

  const prompt = ref(DEFAULT_PROMPT);
  const negativePrompt = ref(DEFAULT_NEGATIVE_PROMPT);

  const seed = ref<string | null>(null);

  const sampler = ref<typeof Samplers[number]>(DEFAULT_SAMPLER);
  const steps = ref(DEFAULT_STEPS);
  const cfg = ref(DEFAULT_CFG);
  const width = ref(DEFAULT_WIDTH);
  const height = ref(DEFAULT_HEIGHT);

  const imagesInQueue = ref(0);
  const progress = ref(0);
  const eta = ref(0);
  const previewImage = ref<string>("");

  const generatedImages = ref<ImageObject[]>([]);

  useUserQueueSocket({
    imageFinishedCallback(generationEvent) {
      console.log('Generated Image id: ', generationEvent.image.id);
      generatedImages.value.unshift(generationEvent.image)
      imagesInQueue.value = generationEvent.queuePosition || 0;
      resetProgressState();
    },
    progressCallback(progressEvent) {
      progress.value = progressEvent.progress * 100;
      eta.value = progressEvent.eta_relative;
      previewImage.value = progressEvent.current_image ? `data:image/png;base64,${progressEvent.current_image}` : "";
    },
  });

  const resetProgressState = () => {
    progress.value = 0;
    eta.value = 0;
    previewImage.value = "";
  };


  const generateImage = async () => {
    try {
      const body = {
        prompt: prompt.value,
        negativePrompt: negativePrompt.value,
        sampler: sampler.value,
        steps: steps.value,
        cfg: cfg.value,
        width: width.value,
        height: height.value,
        seed: seed.value || undefined,
      };
      const response = await $fetch<{ queuePosition: number }>(
        "/api/generate/txt2img",
        {
          ...fetchOptions,
          method: "POST",
          body: JSON.stringify(body),
        }
      );
      imagesInQueue.value = response.queuePosition;
    } catch (error) {
      console.log(error);
    }
  };

  return {
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
    possibleImageSideSizes: POSSIBLE_IMAGE_SIZES,
    samplers: Samplers,
  }
};
