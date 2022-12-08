import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export type PortainerContainer = {
  Command: string;
  Created: number;
  Id: string;
  Image: string;
  ImageID: string;
  Mounts: any[];
  Names: string[];
  NetworkSettings: unknown;
  Ports: {
    IP?: string;
    PrivatePort: number;
    PublicPort?: number;
    Type: string;
  }[];
  State: string;
  Status: string;
};

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

    const { data } = await firstValueFrom(
      this.httpService.post(
        `/endpoints/2/docker/containers/${stableDiffusionContainer.Id}/start`,
        {},
        {
          baseURL: this.configService.get('PORTAINER_URL'),
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      ),
    );
    this.logger.log('Started Stable Diffusion container! 🚀');
    return data;
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

    const { data } = await firstValueFrom(
      this.httpService.get(
        `/endpoints/2/docker/containers/${stableDiffusionContainer.Id}/logs?stderr=1&stdout=1&tail=10&timestamps=1`,
        {
          baseURL: this.configService.get('PORTAINER_URL'),
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      ),
    );
    this.logger.log('Got Stable Diffusion logs');
    return data;
  }
}
