import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { JwtObject } from 'src/auth/auth.decorator';
import { JwtPayload } from 'src/auth/auth.service';
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
    @Query('page') pageId: string,
  ) {
    const votes = await this.voteService.getVotesByUserIdIncludingImage(
      loginInfo.id,
      type,
      pageId,
      20,
    );
    return votes;
  }

  @Get('my-vote-counts')
  async voteCountsByUser(@JwtObject() loginInfo: JwtPayload) {
    const results = await this.voteService.getVoteCountsByUser(loginInfo.id);
    const total = results.reduce((acc, cur) => acc + cur._count, 0);
    return {
      results,
      count: total,
    };
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
    return voteImageIds;
  }
}
