import { Samplers } from '~~/constants';
import { useGenerateStore } from '~~/store/generate';
import { ImageObject } from '~~/types';
import { getFetchOptions } from '~~/utils/general';

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

export const useGenerate = () => {
  const fetchOptions = getFetchOptions();

  const generateStore = useGenerateStore();
  const {
    prompt,
    negativePrompt,
    seed,
    sampler,
    steps,
    cfg,
    width,
    height,
    generatedImages,
   } = storeToRefs(generateStore);

  const imagesInQueue = ref(0);
  const progress = ref(0);
  const eta = ref(0);
  const previewImage = ref<string>('');

  const resetProgressState = () => {
    progress.value = 0;
    eta.value = 0;
    previewImage.value = '';
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
        '/api/generate/txt2img',
        {
          ...fetchOptions,
          method: 'POST',
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
    refreshGenerate: generateStore.resetGenerateState,
  };
};
