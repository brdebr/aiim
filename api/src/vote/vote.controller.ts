import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { JwtObject } from 'src/auth/auth.decorator';
import { JwtPayload } from 'src/auth/auth.service';
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
    @JwtObject() logInfo: JwtPayload,
    @Query('type') type: VoteType,
  ) {
    const votes = this.voteService.getVotesByUserId(logInfo.id, type);
    return votes;
  }

  @Get('voted-image-ids')
  async voteImageIds(
    @JwtObject() logInfo: JwtPayload,
    @Query('type') type: VoteType,
  ) {
    const voteImageIds = this.voteService.getVotedImageIdsByUser(
      logInfo.id,
      type,
    );
    return voteImageIds;
  }
}
