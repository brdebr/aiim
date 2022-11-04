import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { excludeKeys } from 'src/utils';

@Injectable()
export class ImageObjectService {
  constructor(private readonly prisma: PrismaService) {}

  async allPrompts() {
    const queryResponse = await this.prisma.imageObject.groupBy({
      by: ['prompt'],
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

  async page(size = 100, skip = 0) {
    const queryResponse = await this.prisma.imageObject.findMany({
      take: size,
      skip,
      orderBy: {
        generatedAt: 'desc',
      },
    });
    return queryResponse.map((img) =>
      excludeKeys(
        img,
        'imageFile',
        'rawParameters',
        'createdAt',
        'updatedAt',
        'number',
        'fileName',
      ),
    );
  }
}
