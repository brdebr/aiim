import { Injectable, NotFoundException } from '@nestjs/common';
import { ImageObject, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { bytesToHuman } from 'src/utils';
import { ImageSearchDto } from './dto/searchDto';

export const defaultImageFieldsSelect: Prisma.ImageObjectSelect = {
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
  fileName: true,
};

export const defaultsWithFile: Prisma.ImageObjectSelect = {
  ...defaultImageFieldsSelect,
  imageFile: true,
};

type ImageObjectFilter = {
  [key in keyof ImageObject]?: ImageObject[key] extends string
    ? Prisma.StringFilter // if string, use string filter
    : ImageObject[key] extends number
    ? Prisma.IntFilter | number // if number, use int filter
    : ImageObject[key] extends Array<string>
    ? Prisma.StringNullableListFilter // if array of strings, use string list filter
    : ImageObject[key]; // otherwise, use the type as is
};

type ImageObjectKeyArray = (keyof ImageObject)[];

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

  async groupedByCustom(keyArray: ImageObjectKeyArray) {
    const queryResponse = await this.prisma.imageObject.groupBy({
      by: keyArray,
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

  async advancedSearch(params: ImageSearchDto, size = 20, cursorId?: string) {
    const cursor = cursorId ? { id: cursorId } : undefined;
    const skip = cursorId ? 1 : 0;
    const whereObject: Prisma.ImageObjectWhereInput = {
      prompt: {
        contains: params.prompt,
        mode: 'insensitive',
      },
      negativePrompt: {
        contains: params.negativePrompt,
        mode: 'insensitive',
      },
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

    const count = await this.prisma.imageObject.count({
      where: whereObject,
    });

    const queryResponse = await this.prisma.imageObject.findMany({
      take: size,
      skip,
      cursor,
      orderBy: {
        id: 'desc',
      },
      where: whereObject,
      select: defaultImageFieldsSelect,
    });
    const result = this.addHumanFileSize(queryResponse);
    return { result, count };
  }

  async searchGroupedByPrompts(q: string) {
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

  async pageRandomImages(size = 20) {
    const allIds = await this.getAllIds();
    const randomIdsArray = await this.getAmountOfRandomItems(allIds, size);
    return this.getImagesByIds(randomIdsArray);
  }

  async randomImagesFiltered(size = 20, filters: ImageObjectFilter) {
    const allIds = await this.getAllIdsFiltered(filters);
    const randomIdsArray = await this.getAmountOfRandomItems(allIds, size);
    return this.getImagesByIds(randomIdsArray);
  }

  async getAllIdsFiltered(filters: ImageObjectFilter) {
    const queryResponse = await this.prisma.imageObject.findMany({
      where: {
        ...filters,
      },
      select: {
        id: true,
      },
    });
    return queryResponse.map((image) => image.id);
  }

  async getAllIds() {
    const queryResponse = await this.prisma.imageObject.findMany({
      select: {
        id: true,
      },
    });
    return queryResponse.map((img) => img.id);
  }

  async getImagesByIds(ids: string[], size = 20) {
    if (!ids.length) {
      return [];
    }
    const queryResponse = await this.prisma.imageObject.findMany({
      take: size,
      where: {
        id: {
          in: ids,
        },
      },
      select: defaultImageFieldsSelect,
    });
    return this.addHumanFileSize(queryResponse);
  }

  async getAmountOfRandomItems(array: Array<unknown>, size = 20) {
    if (!array.length) {
      return [];
    }
    const randomSet = new Set();
    while (randomSet.size < size) {
      randomSet.add(array[Math.floor(Math.random() * array.length)]);
    }
    const randomIdsArray = Array.from(randomSet) as string[];
    return randomIdsArray;
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
    return this.addHumanFileSize(queryResponse);
  }

  async pageIncludingFile(size = 20, cursorId?: string) {
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
    return this.addHumanFileSize(queryResponse);
  }

  addHumanFileSize(images: Partial<ImageObject>[]) {
    return images.map((img) => {
      const sizeInHuman = bytesToHuman(img.imageSize);
      const returnObj = { ...img, fileSize: sizeInHuman };
      return returnObj;
    });
  }

  async cardGamePage(votedImageIds: string[], size = 10) {
    const allIds = await this.getAllIds();
    const filteredIds = allIds.filter((id) => !votedImageIds.includes(id));
    const randomIdsArray = await this.getAmountOfRandomItems(filteredIds, size);
    return this.getImagesByIds(randomIdsArray);
  }

  async deleteImage(id: string) {
    const imageToDelete = await this.prisma.imageObject.findUnique({
      where: { id },
    });
    if (!imageToDelete) {
      throw new NotFoundException('Image not found');
    }
    const copiedImage = await this.prisma.imageObjectDeleted.create({
      data: {
        ...imageToDelete,
      },
    });

    await this.prisma.imageObject.delete({
      where: { id },
    });
    return copiedImage;
  }
}
