import { Body, Controller, Logger, Post, Res } from '@nestjs/common';
import { JwtObject } from 'src/auth/auth.decorator';
import { JwtPayload } from 'src/auth/auth.service';
import { Text2ImageDto } from './dto/generateDto';
import { ImageGenerationService } from './image-generation.service';

@Controller('generate')
export class ImageGenerationController {
  constructor(private readonly imageGenService: ImageGenerationService) {}

  private readonly logger = new Logger(ImageGenerationController.name);

  @Post('txt2img')
  async generate(
    @JwtObject() loginInfo: JwtPayload,
    @Body() params: Text2ImageDto,
  ) {
    const numberInQueue = await this.imageGenService.generateImage(
      params,
      loginInfo.id,
    );
    this.logger.log(
      `User '${loginInfo.id}' is in queue position: ${numberInQueue}`,
    );

    return {
      queuePosition: numberInQueue,
    };
  }
}
