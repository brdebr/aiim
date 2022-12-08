import { Module } from '@nestjs/common';
import { SdConfigService } from './sd-config.service';
import { SdConfigController } from './sd-config.controller';
import { HttpModule } from '@nestjs/axios';

const SdConfigHttpModule = HttpModule.register({
  timeout: 0,
  maxRedirects: 5,
});

@Module({
  imports: [SdConfigHttpModule],
  providers: [SdConfigService],
  controllers: [SdConfigController],
})
export class SdConfigModule {}
