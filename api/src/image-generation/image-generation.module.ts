import { Module } from '@nestjs/common';
import { ImageGenerationService } from './image-generation.service';
import { ImageGenerationController } from './image-generation.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('GENERATION_API_URL'),
        timeout: 0,
        maxRedirects: 5,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ImageGenerationService],
  controllers: [ImageGenerationController],
})
export class ImageGenerationModule {}
