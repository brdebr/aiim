import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

type SignUpDao = {
  email: string;
  password: string;
  name?: string;
};

@Controller()
export class UserController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('auth/signup')
  async signUp(@Body() body: SignUpDao) {
    const userCreated = await this.prisma.user.create({
      data: {
        name: body.name || undefined,
        email: body.email,
        password: body.password,
      },
    });
    return userCreated;
  }
}
