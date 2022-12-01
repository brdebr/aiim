import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Text2ImageDto } from './dto/generateDto';
import {
  TextToImageGenerationJobType,
  ImageGenerationRequest,
} from './image-generation.processor';

export type generateImageParams = Partial<ImageGenerationRequest>;

@Injectable()
export class ImageGenerationService {
  constructor(
    @InjectQueue('generation')
    private generationQueue: Queue<TextToImageGenerationJobType>,
  ) {}

  parseParams(params: Text2ImageDto): ImageGenerationRequest {
    const {
      prompt,
      negativePrompt,
      steps,
      sampler,
      cfg,
      seed,
      width,
      height,
      faceRestoration,
      denoisingHr,
      firstPassHr,
    } = params;

    return {
      prompt,
      negative_prompt: negativePrompt,
      sampler_name: sampler,
      cfg_scale: cfg,
      seed: parseInt(`${seed}`),
      width,
      height,
      restore_faces: faceRestoration,
      denoising_strength: denoisingHr,
      firstphase_width: firstPassHr,
      steps,
      batch_size: 1,
      n_iter: 1,
    };
  }

  async generateImage(params: Text2ImageDto, userId: string) {
    this.generationQueue.add(
      'txt2img',
      { params, user: userId },
      { timeout: 0 },
    );

    const numberInQueue = await this.generationQueue.count();

    return numberInQueue;
  }
}
