import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  }

  async getAllUsers() {
    const allUsers = await this.prisma.user.findMany();
    return allUsers;
  }

  async deleteUser(id: string) {
    const userDeleted = await this.prisma.user.delete({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return userDeleted;
  }

  async create(email: string, password: string, name?: string) {
    const hashedPassword = await this.hashPassword(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return user;
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    const hashedPassword = await hash(password, saltOrRounds);
    return hashedPassword;
  }

  async validatePassword(password: string, hashedPassword: string) {
    const isPasswordCorrect = await compare(password, hashedPassword);
    return isPasswordCorrect;
  }
}
