import { HttpService } from '@nestjs/axios';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ImageObject } from '@prisma/client';
import { AxiosError } from 'axios';
import { Job } from 'bull';
import {
  catchError,
  firstValueFrom,
  forkJoin,
  interval,
  lastValueFrom,
  map,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { defaultImageFieldsSelect } from 'src/image-object/image-object.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SdConfigService } from 'src/sd-config/sd-config.service';
import { bytesToHuman } from 'src/utils';
import { Text2ImageDto } from './dto/generateDto';

export type ProgressResponse = {
  progress: number;
  eta_relative: number;
  state: {
    skipped: boolean;
    interrupted: boolean;
    job: string;
    job_count: number;
    job_no: number;
    sampling_step: number;
    sampling_steps: number;
  };
  current_image?: string;
};

export const modelHashes = {
  '1.5-emaonly': '81761151',
  '1.5-inpainting': '3e16efc8',
  '1.4': '7460a6fa',
  'bryanwd-person': 'da781e47',
  '1.5-pruned': 'a9263745',
  '2.0-768-v-ema': '2c02b20a',
};

export const modelHashesNames = {
  '81761151': '1.5-emaonly',
  '3e16efc8': '1.5-inpainting',
  '7460a6fa': '1.4',
  da781e47: 'bryanwd-person',
  a9263745: '1.5-pruned',
  '2c02b20a': '2.0-768-v-ema',
};

export type TextToImageGenerationJobType = {
  params: Text2ImageDto;
  user: string;
};

export type ImageGenerationResponse = {
  images: string[];
  parameters: {
    enable_hr: boolean;
    denoising_strength: number;
    firstphase_width: number;
    firstphase_height: number;
    prompt: string;
    styles?: any;
    seed: number;
    subseed: number;
    subseed_strength: number;
    seed_resize_from_h: number;
    seed_resize_from_w: number;
    sampler_name: string;
    batch_size: number;
    n_iter: number;
    steps: number;
    cfg_scale: number;
    width: number;
    height: number;
    restore_faces: boolean;
    tiling: boolean;
    negative_prompt: string;
    eta?: any;
    s_churn: number;
    s_tmax?: any;
    s_tmin: number;
    s_noise: number;
    override_settings?: any;
    sampler_index: string;
  };
  info: string;
};

export type ImageGenerationRequest = {
  prompt: string;
  negative_prompt: string;
  styles?: string[];
  seed?: string | number;
  sampler_name: string;
  batch_size: number;
  n_iter: number;
  steps: number;
  cfg_scale: number;
  width: number;
  height: number;
  restore_faces?: boolean;
  firstphase_width?: number;
  firstphase_height?: number;
  denoising_strength?: number;
  tiling?: boolean;
  enable_hr?: boolean;
};

export const PROGRESS_INTERVAL = 1000;

@Processor('generation')
export class ImageGenerationProcessor {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly sdConfigService: SdConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private readonly logger = new Logger(ImageGenerationProcessor.name);

  parseResponseIntoImageObject(
    response: ImageGenerationResponse,
  ): Array<
    Omit<
      ImageObject,
      | 'id'
      | 'number'
      | 'fileName'
      | 'imageSize'
      | 'rawParameters'
      | 'createdAt'
      | 'updatedAt'
      | 'generatedAt'
      | 'timeToGenerate'
      | 'tags'
      | 'embeddings'
    >
  > {
    const { images, parameters, info } = response;
    const {
      prompt,
      negative_prompt,
      steps,
      sampler_name,
      cfg_scale,
      width,
      height,
      restore_faces,
      denoising_strength,
      firstphase_width,
      firstphase_height,
    } = parameters;
    const infoObject: Record<string, string> = JSON.parse(info);

    const result = [];
    let i = 0;

    for (const imageData of images) {
      const imageBuffer = Buffer.from(imageData, 'base64');
      const imageObjectData = {
        prompt,
        negativePrompt: negative_prompt,
        steps,
        seed: infoObject?.['all_seeds']?.[i].toString() || undefined,
        sampler: sampler_name,
        cfg: cfg_scale,
        width,
        height,
        faceRestoration: restore_faces ? 'Codeformer' : undefined,
        denoisingHr: denoising_strength,
        imageFile: imageBuffer,
        modelHash: infoObject['sd_model_hash'],
        model: modelHashesNames[infoObject['sd_model_hash']],
        firstPassHr: null,
      };
      i++;
      result.push(imageObjectData);
    }

    return result;
  }

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
      imagesPerBatch,
      tiling,
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
      tiling,
      denoising_strength: denoisingHr,
      firstphase_width: firstPassHr,
      steps,
      batch_size: imagesPerBatch,
      n_iter: 1,
    };
  }

  @Process('txt2img')
  async generateText2Image(job: Job<TextToImageGenerationJobType>) {
    const endpoint = '/txt2img';

    const { params, user } = job.data;
    const paramsString = JSON.stringify(this.parseParams(params), null, 2);

    const startTime = Date.now();
    this.logger.log(
      `Generating image by '${user}' with params:\n${paramsString}`,
    );
    this.eventEmitter.emit('image-on-queue', {
      params,
      user,
    });

    const fetchRequestAsObservable =
      this.httpService.post<ImageGenerationResponse>(
        endpoint,
        this.parseParams(params),
      );

    const fetchRequestEnded = new Subject();

    const {
      0: { data },
    } = await lastValueFrom(
      forkJoin([
        fetchRequestAsObservable.pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'Ohh nooo, an error happened! :(';
          }),
          tap(() => {
            fetchRequestEnded.next(true);
            fetchRequestEnded.complete();
          }),
        ),
        interval(PROGRESS_INTERVAL).pipe(
          takeUntil(fetchRequestEnded),
          map(() => this.fetchStatus(user, job)),
        ),
      ]),
    );

    const endTime = Date.now();
    const timeToGenerate = endTime - startTime;

    const timeInSeconds = (timeToGenerate / 1000).toFixed(2);
    this.logger.log(`Image generated in ${timeInSeconds}s`);

    try {
      const imageObjects = this.parseResponseIntoImageObject(
        data,
      ) as Array<ImageObject>;

      for (const imageObject of imageObjects) {
        imageObject.timeToGenerate = timeToGenerate;
        imageObject.generatedAt = new Date();
        imageObject.tags = params?.tags || [];
        imageObject.embeddings = [
          ...(await this.getEmbeddingsUsedInPrompt(params.prompt)),
          ...(await this.getEmbeddingsUsedInPrompt(params.negativePrompt)),
        ];
        imageObject.imageSize = imageObject.imageFile.byteLength;

        this.logger.log(`Saving to database...`);
        const generatedImageObject = await this.prisma.imageObject.create({
          data: imageObject,
          select: defaultImageFieldsSelect as {
            [P in keyof ImageObject]: boolean;
          },
        });
        this.logger.log(`Generated image with ID: ${generatedImageObject.id}`);
        this.eventEmitter.emit('image-generated', {
          image: generatedImageObject,
          user,
        });
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
      const finalTime = Date.now();
      const finalTimeInSeconds = (finalTime - startTime) / 1000;
      this.logger.log(
        `Time to generate and save: ${finalTimeInSeconds.toFixed(2)}s`,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  async fetchStatus(userId: string, job: Job<TextToImageGenerationJobType>) {
    const endpoint = '/progress';
    const progressAsObservable = this.httpService
      .get<ProgressResponse>(endpoint, { timeout: PROGRESS_INTERVAL - 50 })
      .pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'Ohh nooo, an error happened fetching the status! :(';
        }),
      );

    this.logger.log(`Fetching status...`);
    const { data } = await firstValueFrom(progressAsObservable);
    this.logger.log(
      `Image generation: [ ${(data.progress * 100).toFixed(
        2,
      )}% ] - Remaining: ${data.eta_relative.toFixed(2)}s`,
    );
    job.progress(data.progress * 100);
    this.eventEmitter.emit('image-progress', {
      response: data,
      user: userId,
    });
  }

  async getEmbeddingsUsedInPrompt(prompt: string): Promise<string[]> {
    const embeddings = this.sdConfigService.getEmbeddings();
    const embeddingsUsed = embeddings.filter((embedding) =>
      prompt.includes(embedding),
    );
    return embeddingsUsed;
  }
}
