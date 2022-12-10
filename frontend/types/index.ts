import { Samplers } from "~~/constants";

export type ImageObject = {
  id: string;
  // Prompt
  prompt: string;
  negativePrompt: string;
  // Configs
  seed: string;
  steps: number;
  sampler: typeof Samplers[number];
  cfg: number;
  width: number;
  height: number;
  // Model
  model: string;
  modelHash: string;
  // High res
  denoisingHr: number;
  firstPassHr: string;
  // Face restoration
  faceRestoration: string;
  // Metadata
  generatedAt: string;
  imageSize: string;
  timeToGenerate: number;
  fileName: string;
  fileSize: string;
};

export type LoginInfo = {
  id: string;
  email: string;
  name?: string;
  role: string;
};
