import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { JwtObject } from 'src/auth/auth.decorator';
import { JwtPayload } from 'src/auth/auth.service';
import { shuffleArray } from 'src/utils';
import { VoteService, VoteType } from './vote.service';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post(':imageId')
  async vote(
    @JwtObject() loginInfo: JwtPayload,
    @Param('imageId') imageId: string,
    @Query('type') type: VoteType,
  ) {
    const vote = this.voteService.voteForImage(imageId, loginInfo.id, type);
    return vote;
  }

  @Get('my-votes')
  async votesByUser(
    @JwtObject() loginInfo: JwtPayload,
    @Query('type') type: VoteType,
  ) {
    const votes = this.voteService.getVotesByUserId(loginInfo.id, type);
    return votes;
  }

  @Get('voted-image-ids')
  async voteImageIds(
    @JwtObject() loginInfo: JwtPayload,
    @Query('type') type: VoteType,
  ) {
    const voteImageIds = await this.voteService.getVotedImageIdsByUser(
      loginInfo.id,
      type,
    );
    shuffleArray(voteImageIds);
    return voteImageIds;
  }
}
