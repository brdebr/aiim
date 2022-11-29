import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { response } from 'express';
import { Text2ImageDto } from './dto/generateDto';
import { ImageGenerationService } from './image-generation.service';

@Controller('generate')
export class ImageGenerationController {
  constructor(private readonly imageGenService: ImageGenerationService) {}

  @Post('txt2img')
  async generate(@Body() params: Text2ImageDto, @Res() response) {
    const firstImage = await this.imageGenService.generateImage(params);

    response.set('Content-Type', 'image/png');
    response.set(
      'Content-Disposition',
      `attachment; filename=${Date.now()}.png`,
    );
    response.send(Buffer.from(firstImage.images[0], 'base64'));
  }
}
