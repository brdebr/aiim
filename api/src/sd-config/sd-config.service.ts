import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import {
  catchError,
  firstValueFrom,
  forkJoin,
  interval,
  lastValueFrom,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import {
  PortainerContainer,
  SdModel,
  SdConfig,
  GetEmbeddingsResponse,
  SdEmbeddingNamed,
} from './types';
import { AxiosError } from 'axios';

export const MODELS_CHECK_INTERVAL_MS = 2000;

@Injectable()
export class SdConfigService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(SdConfigService.name);

  async getPortainerToken() {
    const baseUrl = this.configService.get('PORTAINER_URL');
    this.logger.log('Getting Portainer token...');
    this.logger.log(`Portainer URL: ${baseUrl}`);

    const username = this.configService.get('PORTAINER_USER');
    const password = this.configService.get('PORTAINER_PASS');

    const { data } = await firstValueFrom(
      this.httpService
        .post<{ jwt: string }>(
          '/auth',
          {
            username,
            password,
          },
          {
            baseURL: this.configService.get('PORTAINER_URL'),
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw 'Ohh nooo, an error happened getting the Portainer token! :(';
          }),
        ),
    );
    this.logger.log('Got Portainer token');
    return data;
  }

  async getPortainerStatus(token?: string) {
    const jwtToken = token || (await this.getPortainerToken()).jwt;
    this.logger.log('Getting Portainer status...');
    const { data } = await firstValueFrom(
      this.httpService
        .get<PortainerContainer[]>(
          '/endpoints/2/docker/containers/json?all=true',
          {
            baseURL: this.configService.get('PORTAINER_URL'),
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw 'Ohh nooo, an error happened getting the Portainer status! :(';
          }),
        ),
    );
    this.logger.log('Got Portainer status');
    return data;
  }

  async startStableDiffusionContainer(token?: string) {
    const jwtToken = token || (await this.getPortainerToken()).jwt;
    const containers = await this.getPortainerStatus(jwtToken);
    const stableDiffusionContainer = containers.find((container) =>
      container.Image.includes('sd-auto'),
    );
    this.logger.log('Starting Stable Diffusion container...');

    const startSdEngineRequest = this.httpService.post(
      `/endpoints/2/docker/containers/${stableDiffusionContainer.Id}/start`,
      {},
      {
        baseURL: this.configService.get('PORTAINER_URL'),
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );

    const startContainerRequestEnded = new Subject();

    await lastValueFrom(
      forkJoin([
        startSdEngineRequest.pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw 'Ohh nooo, an error happened starting the SD container! :(';
          }),
        ),
        interval(MODELS_CHECK_INTERVAL_MS).pipe(
          takeUntil(startContainerRequestEnded),
          switchMap(() => this.getModels()),
          tap((models) => {
            if (!models.length) {
              this.logger.log('Loading models...');
              return;
            }
            this.logger.log('Models loaded!');
            startContainerRequestEnded.next(true);
            startContainerRequestEnded.complete();
          }),
        ),
      ]),
    );

    this.logger.log('Started Stable Diffusion container! 🚀');

    const logs = await this.getStableDiffusionLogs(jwtToken);
    return logs;
  }

  async stopStableDiffusionContainer(token?: string) {
    const jwtToken = token || (await this.getPortainerToken()).jwt;
    const containers = await this.getPortainerStatus(jwtToken);
    const stableDiffusionContainer = containers.find((container) =>
      container.Image.includes('sd-auto'),
    );
    this.logger.log('Stopping Stable Diffusion container...');
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .post(
            `/endpoints/2/docker/containers/${stableDiffusionContainer.Id}/stop`,
            {},
            {
              baseURL: this.configService.get('PORTAINER_URL'),
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            },
          )
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error);
              throw 'Ohh nooo, an error happened stopping the SD container! :(';
            }),
          ),
      );
      this.logger.log('Stopped Stable Diffusion container!');
      return data;
    } catch (error) {
      this.logger.error(error);
      return 'Error stopping the SD container';
    }
  }

  async getStableDiffusionLogs(token?: string) {
    const jwtToken = token || (await this.getPortainerToken()).jwt;
    const containers = await this.getPortainerStatus(jwtToken);
    const stableDiffusionContainer = containers.find((container) =>
      container.Image.includes('sd-auto'),
    );
    this.logger.log('Getting Stable Diffusion logs...');

    const params = new URLSearchParams({
      stderr: '1',
      stdout: '1',
      tail: '50',
    });

    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<string>(
            `/endpoints/2/docker/containers/${
              stableDiffusionContainer.Id
            }/logs?${params.toString()}`,
            {
              baseURL: this.configService.get('PORTAINER_URL'),
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            },
          )
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error);
              throw 'Ohh nooo, an error happened getting the SD logs! :(';
            }),
          ),
      );
      this.logger.log('Got Stable Diffusion logs');
      const logs = data.toString();

      return logs;
    } catch (error) {
      this.logger.error(error);
      return 'Error getting the SD logs';
    }
  }

  async getModels() {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<SdModel[]>('/sd-models', {
            baseURL: this.configService.get('GENERATION_API_URL'),
          })
          .pipe(
            catchError(() => {
              return of({ data: [] as SdModel[] });
            }),
          ),
      );
      return data;
    } catch (error) {
      this.logger.error('Error getting the models');
      this.logger.error(error);
      return [];
    }
  }

  async setModel(modelTitle: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .post(
            '/options',
            { sd_model_checkpoint: modelTitle },
            {
              baseURL: this.configService.get('GENERATION_API_URL'),
            },
          )
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error);
              throw 'Ohh nooo, an error happened setting the model! :(';
            }),
          ),
      );
      return data;
    } catch (error) {
      this.logger.error(error);
      return 'Error setting the model';
    }
  }

  async getConfigs() {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<SdConfig>('/options', {
            baseURL: this.configService.get('GENERATION_API_URL'),
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error);
              throw 'Ohh nooo, an error happened getting the configs! :(';
            }),
          ),
      );
      return data;
    } catch (error) {
      this.logger.error(error);
      return {};
    }
  }

  async getEmbeddings(): Promise<SdEmbeddingNamed[]> {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<GetEmbeddingsResponse>('/embeddings', {
            baseURL: this.configService.get('GENERATION_API_URL'),
          })
          .pipe(
            catchError(() => {
              return of({
                data: { loaded: {}, skipped: {} } as GetEmbeddingsResponse,
              });
            }),
          ),
      );
      const loadedEmbeddings = Object.keys(data.loaded).map((key) => ({
        ...data.loaded[key],
        name: key,
      }));
      loadedEmbeddings.sort((a, b) => a.name.localeCompare(b.name));
      return loadedEmbeddings;
    } catch (error) {
      this.logger.error('Error getting the models');
      this.logger.error(error);
      return [];
    }
  }
}
