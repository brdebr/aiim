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
import { PortainerContainer, SdModel, SdConfig } from './types';
import { AxiosError } from 'axios';

export const MODELS_CHECK_INTERVAL_MS = 2000;

@Injectable()
export class SdConfigService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(SdConfigService.name);

  embeddings: string[] = [];

  async getPortainerToken() {
    const baseUrl = this.configService.get('PORTAINER_URL');
    this.logger.log('Getting Portainer token...');
    this.logger.log(`Portainer URL: ${baseUrl}`);

    const username = this.configService.get('PORTAINER_USER');
    const password = this.configService.get('PORTAINER_PASS');

    const { data } = await firstValueFrom(
      this.httpService.post<{ jwt: string }>(
        '/auth',
        {
          username,
          password,
        },
        {
          baseURL: this.configService.get('PORTAINER_URL'),
        },
      ),
    );
    this.logger.log('Got Portainer token');
    return data;
  }

  async getPortainerStatus(token?: string) {
    const jwtToken = token || (await this.getPortainerToken()).jwt;
    this.logger.log('Getting Portainer status...');
    const { data } = await firstValueFrom(
      this.httpService.get<PortainerContainer[]>(
        '/endpoints/2/docker/containers/json?all=true',
        {
          baseURL: this.configService.get('PORTAINER_URL'),
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
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
            this.logger.error(error.response.data);
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

    this.logger.log('Getting embeddings...');
    const logs = await this.getStableDiffusionLogs(jwtToken);
    const embeddingsStr =
      /Embeddings: (?<content>.*)/gm.exec(logs)?.groups?.content || '';
    const embeddings = embeddingsStr
      .split(',')
      .map((embedding) => embedding.trim());
    embeddings.sort((a, b) => a.localeCompare(b));

    this.embeddings = embeddings;
    this.logger.log(`Found [ ${embeddings.length} ] embeddings!`);

    return embeddings;
  }

  async stopStableDiffusionContainer(token?: string) {
    const jwtToken = token || (await this.getPortainerToken()).jwt;
    const containers = await this.getPortainerStatus(jwtToken);
    const stableDiffusionContainer = containers.find((container) =>
      container.Image.includes('sd-auto'),
    );
    this.logger.log('Stopping Stable Diffusion container...');
    const { data } = await firstValueFrom(
      this.httpService.post(
        `/endpoints/2/docker/containers/${stableDiffusionContainer.Id}/stop`,
        {},
        {
          baseURL: this.configService.get('PORTAINER_URL'),
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      ),
    );
    this.logger.log('Stopped Stable Diffusion container!');
    return data;
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

    const { data } = await firstValueFrom(
      this.httpService.get<string>(
        `/endpoints/2/docker/containers/${
          stableDiffusionContainer.Id
        }/logs?${params.toString()}`,
        {
          baseURL: this.configService.get('PORTAINER_URL'),
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      ),
    );
    this.logger.log('Got Stable Diffusion logs');
    const logs = data.toString();

    return logs;
  }

  async getModels() {
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
  }

  async setModel(modelTitle: string) {
    const { data } = await firstValueFrom(
      this.httpService.post(
        '/options',
        { sd_model_checkpoint: modelTitle },
        {
          baseURL: this.configService.get('GENERATION_API_URL'),
        },
      ),
    );
    return data;
  }

  async getConfigs() {
    const { data } = await firstValueFrom(
      this.httpService.get<SdConfig>('/options', {
        baseURL: this.configService.get('GENERATION_API_URL'),
      }),
    );
    return data;
  }

  getEmbeddings() {
    return this.embeddings;
  }
}
