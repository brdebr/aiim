import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { bytesToHuman } from 'src/utils';

export const defaultImageFieldsSelect = {
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

export const defaultsWithFile = {
  ...defaultImageFieldsSelect,
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
      select: defaultImageFieldsSelect,
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

  async random(size = 20) {
    console.time('All ids');
    const allIds = (
      await this.prisma.imageObject.findMany({
        select: {
          id: true,
        },
      })
    ).map((img) => img.id);

    const randomIds = new Set();
    while (randomIds.size < size) {
      randomIds.add(allIds[Math.floor(Math.random() * allIds.length)]);
    }
    const randomIdsArray = Array.from(randomIds) as string[];
    console.timeEnd('All ids');

    const queryResponse = await this.prisma.imageObject.findMany({
      take: size,
      where: {
        id: {
          in: randomIdsArray,
        },
      },
      select: defaultImageFieldsSelect,
    });
    return queryResponse.map((img) => {
      const sizeInHuman = bytesToHuman(img.imageSize);
      const returnObj = { ...img, fileSize: sizeInHuman };
      return returnObj;
    });
  }

  async page(size = 20, cursorId?: string) {
    const cursor = cursorId ? { id: cursorId } : undefined;
    const skip = cursorId ? 1 : 0;
    const queryResponse = await this.prisma.imageObject.findMany({
      take: size,
      skip,
      cursor,
      orderBy: {
        id: 'desc',
      },
      select: defaultImageFieldsSelect,
    });
    return queryResponse.map((img) => {
      const sizeInHuman = bytesToHuman(img.imageSize);
      const returnObj = { ...img, fileSize: sizeInHuman };
      return returnObj;
    });
  }

  async galleryPage(size = 20, cursorId?: string) {
    const cursor = cursorId ? { id: cursorId } : undefined;
    const skip = cursorId ? 1 : 0;
    const queryResponse = await this.prisma.imageObject.findMany({
      take: size,
      skip,
      cursor,
      orderBy: {
        id: 'desc',
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
