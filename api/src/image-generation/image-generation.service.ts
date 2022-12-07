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

  async getUserQueue(userId: string) {
    const jobs = await this.generationQueue.getJobs(['waiting', 'active']);
    const userJobs = jobs.filter((job) => job.data.user === userId);

    return userJobs;
  }

  async generateImage(params: Text2ImageDto, userId: string) {
    this.generationQueue.add(
      'txt2img',
      { params, user: userId },
      { timeout: 0 },
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    const numberInQueue =
      (await this.generationQueue.getJobCounts()).waiting + 1;

    return numberInQueue;
  }
}
