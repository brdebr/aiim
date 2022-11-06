import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { VoteService, VoteType } from './vote.service';

type VoteDao = {
  imageId: string;
  userId: string;
  type: VoteType;
};

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post()
  async vote(@Body() body: VoteDao) {
    const vote = this.voteService.voteForImage(
      body.imageId,
      body.userId,
      body.type,
    );
    return vote;
  }

  @Get('my-votes')
  async votesByUser(
    @Query('id') userId: string,
    @Query('type') type: VoteType,
  ) {
    const votes = this.voteService.getVotesByUserId(userId, type);
    return votes;
  }

  @Get('voted-image-ids')
  async voteImageIds(
    @Query('id') userId: string,
    @Query('type') type: VoteType,
  ) {
    const voteImageIds = this.voteService.getVotedImageIdsByUser(userId, type);
    return voteImageIds;
  }
}
