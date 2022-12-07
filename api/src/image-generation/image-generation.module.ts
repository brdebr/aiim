import { Module } from '@nestjs/common';
import { ImageGenerationService } from './image-generation.service';
import { ImageGenerationController } from './image-generation.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ImageGenerationProcessor } from './image-generation.processor';
import { ImageGenerationGateway } from './image-generation-queue.gateway';
import { JwtNestModule } from 'src/auth/jwt.module';

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
  imports: [GenerationHttpModule, GenerationQueue, JwtNestModule],
  providers: [
    ImageGenerationService,
    ImageGenerationProcessor,
    ImageGenerationGateway,
  ],
  controllers: [ImageGenerationController],
})
export class ImageGenerationModule {}
