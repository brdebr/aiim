import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('generation')
export class ImageGenerationProcessor {
  private readonly logger = new Logger(ImageGenerationProcessor.name);

  @Process('txt2img')
  generateText2Image(job: Job) {
    this.logger.log('Start transcoding...');
    this.logger.log(job.data);
    this.logger.log('Transcoding completed');
  }
}
