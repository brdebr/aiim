import { VoteService } from './../vote/vote.service';
import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { JwtObject, Public } from 'src/auth/auth.decorator';
import { ImageObjectService } from './image-object.service';
import { JwtPayload } from 'src/auth/auth.service';

@Controller('images')
export class ImageObjectController {
  constructor(
    private readonly imageService: ImageObjectService,
    private readonly voteService: VoteService,
  ) {}

  @Public()
  @Get('view/:id')
  async getImage(@Param('id') id: string, @Res() response) {
    const image = await this.imageService.getImage(id);
    response.set('Content-Type', 'image/png');
    response.set('Content-Disposition', `attachment; filename=${image.id}.png`);
    response.send(image.imageFile);
  }

  paseSize = '10';

  @Get()
  page(@Query('size') size = this.paseSize, @Query('page') page?: string) {
    const sizeInt = parseInt(size);
    return this.imageService.page(sizeInt, page);
  }

  @Get('random')
  async random(@Query('size') size = this.paseSize) {
    const sizeInt = parseInt(size);
    const results = await this.imageService.pageRandomImages(sizeInt);
    return results;
  }

  @Public()
  @Get('random-cover')
  async randomCover(@Query('size') size = '5') {
    const sizeInt = parseInt(size);
    const width = 384;
    const height = 704;

    const results = await this.imageService.randomImagesFiltered(sizeInt, {
      width,
      height,
      prompt: {
        contains: 'cyberpunk',
      },
    });
    return results;
  }

  @Get('search')
  async search(@Query('q') q) {
    const results = await this.imageService.search(q);
    return {
      count: results.length,
      results,
    };
  }

  @Get('total')
  count() {
    return this.imageService.count();
  }

  @Get('prompts')
  allPrompts() {
    return this.imageService.allPrompts();
  }

  @Get('search-prompts')
  async searchPrompts(@Query('q') q) {
    const results = await this.imageService.searchGroupedByPrompts(q);
    return {
      resultsCount: results.length,
      total: results.reduce((acc, cur) => acc + cur._count, 0),
      results,
    };
  }

  @Get('card-game')
  async cardGame(@JwtObject() loginInfo: JwtPayload) {
    const votedImageIds = await this.voteService.getVotedImageIdsByUser(
      loginInfo.id,
    );
    const results = await this.imageService.cardGamePage(votedImageIds);
    return results;
  }
}
