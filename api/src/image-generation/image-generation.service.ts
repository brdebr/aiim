import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
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

  private readonly logger = new Logger(ImageGenerationService.name);

  async getUserQueue(userId: string) {
    const jobs = await this.generationQueue.getJobs(['waiting', 'active']);
    const userJobs = jobs.filter((job) => job.data.user === userId);

    return userJobs;
  }

  async generateImage(params: Text2ImageDto, userId: string) {
    for (const i of Array(params.batchesToGenerate).keys()) {
      this.logger.log(`Adding job ${i + 1}/${params.batchesToGenerate}`);
      await this.generationQueue.add(
        'txt2img',
        { params, user: userId },
        { timeout: 0 },
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    const numberInQueue =
      (await this.generationQueue.getJobCounts()).waiting + 1;

    return numberInQueue;
  }
}
