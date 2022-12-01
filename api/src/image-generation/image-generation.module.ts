import { Module } from '@nestjs/common';
import { ImageGenerationService } from './image-generation.service';
import { ImageGenerationController } from './image-generation.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ImageGenerationProcessor } from './image-generation.processor';

const GenerationHttpModule = HttpModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    baseURL: configService.get('GENERATION_API_URL'),
    timeout: 0,
    maxRedirects: 5,
  }),
  inject: [ConfigService],
});

const GenerationQueue = BullModule.registerQueue({
  name: 'generation',
});

@Module({
  imports: [GenerationHttpModule, GenerationQueue],
  providers: [ImageGenerationService, ImageGenerationProcessor],
  controllers: [ImageGenerationController],
})
export class ImageGenerationModule {}
