import { Samplers } from '~~/constants';
import { ImageObject } from '~~/types';

export const DEFAULT_PROMPT = 'a fluffy cat sitting on top of a table';
export const DEFAULT_NEGATIVE_PROMPT =
  'poorly drawn, ugly, tiling, out of frame, extra limbs, disfigured, deformed, cross-eye, body out of frame, blurry, bad art, blurred, text, watermark, grainy, writing, calligraphy, cut off, disfigured, kitsch, oversaturated, grain, low-res, disgusting, childish';

export const DEFAULT_SAMPLER = 'Euler a';
export const DEFAULT_STEPS = 28;
export const DEFAULT_CFG = 9;
export const DEFAULT_WIDTH = 768;
export const DEFAULT_HEIGHT = 768;

export const useGenerateStore = definePiniaStore('generate', () => {

  const prompt = ref(DEFAULT_PROMPT);
  const negativePrompt = ref(DEFAULT_NEGATIVE_PROMPT);

  const seed = ref<string | null>(null);

  const sampler = ref<typeof Samplers[number]>(DEFAULT_SAMPLER);
  const steps = ref(DEFAULT_STEPS);
  const cfg = ref(DEFAULT_CFG);
  const width = ref(DEFAULT_WIDTH);
  const height = ref(DEFAULT_HEIGHT);
  const restoreFaces = ref(false);
  const tiling = ref(false);

  const batchesToGenerate = ref(1);
  const imagesPerBatch = ref(1);

  const resetGenerateState = () => {
    prompt.value = DEFAULT_PROMPT;
    negativePrompt.value = DEFAULT_NEGATIVE_PROMPT;
    seed.value = null;
    sampler.value = DEFAULT_SAMPLER;
    steps.value = DEFAULT_STEPS;
    cfg.value = DEFAULT_CFG;
    width.value = DEFAULT_WIDTH;
    height.value = DEFAULT_HEIGHT;
    restoreFaces.value = false;
    tiling.value = false;
    batchesToGenerate.value = 1;
    imagesPerBatch.value = 1;
  };

  const sendToGenerate = (image: ImageObject) => {
    prompt.value = image.prompt;
    negativePrompt.value = image.negativePrompt;
    sampler.value = image.sampler;
    steps.value = image.steps;
    cfg.value = image.cfg;
    width.value = image.width;
    height.value = image.height;
    restoreFaces.value = !!image.faceRestoration;
    tiling.value = image.tiling;
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
    restoreFaces,
    tiling,
    batchesToGenerate,
    imagesPerBatch,
    sendToGenerate,
    resetGenerateState,
  };
});
