import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export enum VoteType {
  UPVOTE = 'UPVOTE',
  DOWNVOTE = 'DOWNVOTE',
  FAVORITE = 'FAVORITE',
}

@Injectable()
export class VoteService {
  constructor(private readonly prisma: PrismaService) {}

  async voteForImage(imageId: string, userId: string, voteType: VoteType) {
    const vote = await this.prisma.vote.create({
      data: {
        vote: voteType,
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
}
