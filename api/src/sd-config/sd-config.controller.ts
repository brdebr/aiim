import { Body, Controller, Get, Post } from '@nestjs/common';
import { setSdModelDto } from './dto/sdConfigDto';
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
          ports: Array.from(
            new Set([
              ...container.Ports.filter(
                (port) => port.PrivatePort && port.PublicPort,
              ).map((port) => {
                return `${port.PublicPort}:${port.PrivatePort}`;
              }),
            ]),
          ),
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
    const result = await this.sdConfigService.getStableDiffusionLogs();
    return result;
  }

  @Get('sd-models')
  async getSdModels() {
    const result = await this.sdConfigService.getModels();
    return result;
  }

  @Post('sd-model')
  async setSdModel(@Body() sdModel: setSdModelDto) {
    const result = await this.sdConfigService.setModel(sdModel.modelTitle);
    return result;
  }

  @Get('configs')
  async getSdConfig() {
    const result = await this.sdConfigService.getConfigs();
    return result;
  }
}
