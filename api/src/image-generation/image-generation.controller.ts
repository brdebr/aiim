import { Body, Controller, Post, Res } from '@nestjs/common';
import { JwtObject } from 'src/auth/auth.decorator';
import { JwtPayload } from 'src/auth/auth.service';
import { Text2ImageDto } from './dto/generateDto';
import { ImageGenerationService } from './image-generation.service';

@Controller('generate')
export class ImageGenerationController {
  constructor(private readonly imageGenService: ImageGenerationService) {}

  @Post('txt2img')
  async generate(
    @JwtObject() loginInfo: JwtPayload,
    @Body() params: Text2ImageDto,
    @Res() response,
  ) {
    const numberInQueue = await this.imageGenService.generateImage(
      params,
      loginInfo.id,
    );

    response
      .status(200)
      .send(`Your image is in queue. Number in queue: ${numberInQueue + 1}`);
  }
}
