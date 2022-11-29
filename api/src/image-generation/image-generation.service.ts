import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { Text2ImageDto } from './dto/generateDto';

type ImageGenerationResponse = {
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

export type generateImageParams = Partial<ImageGenerationRequest>;

@Injectable()
export class ImageGenerationService {
  constructor(private readonly httpService: HttpService) {}
  private logger = new Logger(ImageGenerationService.name);

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

  async generateImage(params: Text2ImageDto) {
    const endpoint = '/txt2img';
    const parsedParams = this.parseParams(params);

    this.logger.log(
      `Generating image with params: ${JSON.stringify(parsedParams)}`,
    );

    const fetchObservable = this.httpService.post<ImageGenerationResponse>(
      endpoint,
      parsedParams,
    );
    const { data } = await firstValueFrom(
      fetchObservable.pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }
}
