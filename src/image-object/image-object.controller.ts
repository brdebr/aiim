import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ImageObjectService } from './image-object.service';

@Controller('images')
export class ImageObjectController {
  constructor(private readonly imageService: ImageObjectService) {}

  @Get()
  page(@Query('size') size = '10', @Query('page') page = '1') {
    const pageInt = parseInt(page);
    const sizeInt = parseInt(size);

    return this.imageService.page(sizeInt, (pageInt - 1) * sizeInt);
  }

  @Get('total')
  count() {
    return this.imageService.count();
  }

  @Get('prompts')
  allPrompts() {
    return this.imageService.allPrompts();
  }

  @Get(':id')
  async getImage(@Param('id') id: string, @Res() response) {
    const image = await this.imageService.getImage(id);
    response.set('Content-Type', 'image/png');
    response.send(image.imageFile);
  }
}
