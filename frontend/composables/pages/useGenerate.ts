import { Samplers } from '~~/constants';
import { useGenerateStore } from '~~/store/generate';
import { ImageObject } from '~~/types';

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
  const { sendTxt2ImageGenerate } = useApi();

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
    restoreFaces,
    tiling,
    batchesToGenerate,
    imagesPerBatch,
   } = storeToRefs(generateStore);

  const socketStore = useSocketStore();
  const { eta, imagesInQueue, progress, previewImage, generatedImages } = storeToRefs(socketStore);

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
        faceRestoration: restoreFaces.value,
        tiling: tiling.value,
        batchesToGenerate: batchesToGenerate.value,
        imagesPerBatch: imagesPerBatch.value,
      };
      const response = await sendTxt2ImageGenerate(body);
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
    generateImage,
    possibleImageSideSizes: POSSIBLE_IMAGE_SIZES,
    samplers: Samplers,
    refreshGenerate: generateStore.resetGenerateState,
    generatedImages,
    restoreFaces,
    tiling,
    batchesToGenerate,
    imagesPerBatch,
  };
};
