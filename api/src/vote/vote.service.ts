import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ImageSearchDto } from 'src/image-object/dto/searchDto';
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

export type searchVotesByUserIdIncludingImageFn = {
  userId: string;
  voteType?: VoteType;
  pageId?: string;
  size: number;
  params: ImageSearchDto;
};

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

  async searchVotesByUserIdIncludingImage(
    args: searchVotesByUserIdIncludingImageFn,
  ) {
    const { userId, voteType, pageId, size, params } = args;
    const cursor = pageId ? { id: pageId } : undefined;
    const skip = pageId ? 1 : 0;
    const whereImageObject: Prisma.ImageObjectWhereInput = {
      prompt: params.prompt
        ? {
            contains: params.prompt,
            mode: 'insensitive',
          }
        : undefined,
      negativePrompt: params.negativePrompt
        ? {
            contains: params.negativePrompt,
            mode: 'insensitive',
          }
        : undefined,
      modelHash: {
        equals: params.model,
      },
      sampler: {
        equals: params.sampler,
      },
      cfg: {
        equals: params.cfg,
      },
      width: {
        equals: params.width,
      },
      height: {
        equals: params.height,
      },
      seed: {
        equals: params.seed,
      },
      steps: {
        equals: params.steps,
      },
    };

    const votes = await this.prisma.vote.findMany({
      cursor,
      skip,
      take: size,
      where: {
        userId: userId,
        vote: voteType,
        image: whereImageObject,
      },
      include: {
        image: {
          select: defaultImageFieldsSelect,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const length = votes.length;

    return {
      result: votes.map((vote) => excludeKeys(vote, 'userId', 'imageId')),
      count: length,
    };
  }

  async getVotesByUserIdIncludingImage(
    userId: string,
    voteType?: VoteType,
    pageId?: string,
    size = 20,
  ) {
    const cursor = pageId ? { id: pageId } : undefined;
    const skip = pageId ? 1 : 0;
    const votes = await this.prisma.vote.findMany({
      cursor,
      skip,
      take: size,
      where: {
        userId: userId,
        vote: voteType,
      },
      include: {
        image: {
          select: defaultImageFieldsSelect,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    console.log('votes', votes);
    const length = votes.length;

    return {
      results: votes.map((vote) => excludeKeys(vote, 'userId', 'imageId')),
      count: length,
    };
  }

  async getVoteCountsByUser(userId: string) {
    const votes = await this.prisma.vote.groupBy({
      by: ['vote'],
      _count: true,
      where: {
        userId,
      },
    });
    return votes;
  }

  async getVotedImageIdsByUser(userId: string, voteType?: VoteType) {
    const votes = await this.prisma.vote.findMany({
      where: {
        userId: userId,
        vote: voteType,
      },
      select: {
        imageId: true,
      },
    });
    return votes.map((vote) => vote.imageId);
  }

  async getAllVotedImageIdsByUser(userId: string) {
    const votes = await this.prisma.vote.findMany({
      where: {
        userId,
      },
      select: {
        imageId: true,
      },
    });
    return votes.map((vote) => vote.imageId);
  }
}
