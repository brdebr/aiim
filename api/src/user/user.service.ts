import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async signUp(email: string, password: string, name?: string) {
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return user;
  }
}
