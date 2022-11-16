import { Injectable, Logger } from '@nestjs/common';
import { defaultImageFieldsSelect } from 'src/image-object/image-object.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { excludeKeys } from 'src/utils';

export enum VoteType {
  UPVOTE = 'UPVOTE',
  DOWNVOTE = 'DOWNVOTE',
  FAVORITE = 'FAVORITE',
  TO_MODIFY = 'TO_MODIFY',
  TO_UPSCALE = 'TO_UPSCALE',
}

@Injectable()
export class VoteService {
  constructor(private readonly prisma: PrismaService) {}

  private logger = new Logger(VoteService.name);

  async voteForImage(imageId: string, userId: string, voteType: VoteType) {
    const voteStr = voteType ? ` - ${voteType}` : '';
    this.logger.log(
      `Voting for image "${imageId}" by user "${userId}${voteStr}"`,
    );

    const vote = await this.prisma.vote.upsert({
      where: {
        userId_imageId: {
          userId,
          imageId,
        },
      },
      create: {
        userId,
        imageId,
        vote: voteType,
      },
      update: {
        vote: voteType,
      },
    });

    return vote;
  }

  async getVotesByUserId(userId: string, voteType?: VoteType, size = 150) {
    const votes = await this.prisma.vote.findMany({
      where: {
        userId: userId,
        vote: voteType || VoteType.UPVOTE,
      },
      include: {
        image: {
          select: {
            ...defaultImageFieldsSelect,
          },
        },
      },
      take: size,
    });
    const length = votes.length;

    return {
      results: votes.map((vote) => excludeKeys(vote, 'userId', 'imageId')),
      count: length,
    };
  }

  async getVotedImageIdsByUser(userId: string, voteType?: VoteType) {
    const votes = await this.prisma.vote.findMany({
      where: {
        userId: userId || '',
        vote: voteType,
      },
      select: {
        imageId: true,
      },
    });
    return votes.map((vote) => vote.imageId);
  }
}
