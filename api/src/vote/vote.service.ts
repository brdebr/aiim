import { Injectable } from '@nestjs/common';
import { defaultImageFieldsSelect } from 'src/image-object/image-object.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { excludeKeys } from 'src/utils';

export enum VoteType {
  UPVOTE = 'UPVOTE',
  DOWNVOTE = 'DOWNVOTE',
  FAVORITE = 'FAVORITE',
}

@Injectable()
export class VoteService {
  constructor(private readonly prisma: PrismaService) {}

  async voteForImage(imageId: string, userId: string, voteType: VoteType) {
    const existingVote = await this.prisma.vote.findFirst({
      where: {
        imageId: imageId,
        userId: userId,
      },
    });

    if (existingVote) {
      throw new Error('You have already voted for this image dummy! 😥');
    }

    const vote = await this.prisma.vote.create({
      data: {
        vote: voteType || VoteType.UPVOTE,
        image: {
          connect: {
            id: imageId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return vote;
  }

  async getVotesByUserId(userId: string, voteType?: VoteType) {
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
    });

    return votes.map((vote) => excludeKeys(vote, 'userId', 'imageId'));
  }
}
