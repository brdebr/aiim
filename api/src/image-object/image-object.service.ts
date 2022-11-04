import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { bytesToHuman, excludeKeys } from 'src/utils';

const defaultImageFields = {
  id: true,
  // Prompt
  prompt: true,
  negativePrompt: true,
  // Configs
  seed: true,
  steps: true,
  sampler: true,
  cfg: true,
  width: true,
  height: true,
  // Model
  model: true,
  modelHash: true,
  // High res
  denoisingHr: true,
  firstPassHr: true,
  // Face restoration
  faceRestoration: true,
  // Metadata
  generatedAt: true,
  imageSize: true,
  timeToGenerate: true,
};

const defaultsWithFile = {
  ...defaultImageFields,
  imageFile: true,
};

@Injectable()
export class ImageObjectService {
  constructor(private readonly prisma: PrismaService) {}

  async allPrompts() {
    const queryResponse = await this.prisma.imageObject.groupBy({
      by: ['prompt'],
      _count: true,
    });
    return queryResponse;
  }

  async count() {
    const queryResponse = await this.prisma.imageObject.count();
    return queryResponse;
  }

  async getImage(id: string) {
    const queryResponse = await this.prisma.imageObject.findUnique({
      where: { id },
    });
    return queryResponse;
  }

  async search(q: string) {
    const queryResponse = await this.prisma.imageObject.findMany({
      where: {
        prompt: {
          contains: q,
        },
      },
      select: defaultImageFields,
    });
    return queryResponse;
  }

  async searchPrompts(q: string) {
    const queryResponse = await this.prisma.imageObject.groupBy({
      by: ['prompt'],
      _count: true,
      having: {
        prompt: {
          contains: q,
        },
      },
    });
    return queryResponse;
  }

  async page(size = 100, skip = 0) {
    const queryResponse = await this.prisma.imageObject.findMany({
      take: size,
      skip,
      orderBy: {
        generatedAt: 'desc',
      },
      select: defaultImageFields,
    });
    return queryResponse.map((img) => {
      const sizeInHuman = bytesToHuman(img.imageSize);
      const returnObj = { ...img, fileSize: sizeInHuman };
      return returnObj;
    });
  }

  async galleryPage(size = 20, skip = 0) {
    const queryResponse = await this.prisma.imageObject.findMany({
      take: size,
      skip,
      orderBy: {
        generatedAt: 'desc',
      },
      select: defaultsWithFile,
    });
    return queryResponse.map((img) => {
      const sizeInHuman = bytesToHuman(img.imageSize);
      const returnObj = { ...img, fileSize: sizeInHuman };
      return returnObj;
    });
  }
}
