import { Controller, Get, Post } from '@nestjs/common';
import { SdConfigService } from './sd-config.service';

@Controller('sd-config')
export class SdConfigController {
  constructor(private readonly sdConfigService: SdConfigService) {}

  @Get('engine-status')
  async getEngineStatus() {
    const result = await this.sdConfigService.getPortainerStatus();

    return result
      .map((container) => {
        return {
          id: container.Id,
          name: container.Image,
          imageId: container.ImageID,
          ports: [
            ...container.Ports.filter(
              (port) => port.PrivatePort && port.PublicPort,
            ).map((port) => {
              return `${port.PublicPort}:${port.PrivatePort}`;
            }),
          ],
          status: container.State,
          statusTxt: container.Status,
        };
      })
      .filter((container) => container.name.includes('sd-auto'))[0];
  }

  @Post('engine-start')
  async startSdEngine() {
    await this.sdConfigService.startStableDiffusionContainer();
    return 'Started';
  }

  @Post('engine-stop')
  async stopSdEngine() {
    await this.sdConfigService.stopStableDiffusionContainer();
    return 'Stopped';
  }

  @Get('engine-logs')
  async getEngineLogs() {
    return await this.sdConfigService.getStableDiffusionLogs();
  }
}
