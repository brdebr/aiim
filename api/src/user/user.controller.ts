import { JwtPayload } from './../auth/auth.service';
import { UserService } from './user.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtObject } from 'src/auth/auth.decorator';

type SignUpDao = {
  email: string;
  password: string;
  name?: string;
};

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getCurrentUser(@JwtObject() { id }: JwtPayload) {
    const user = await this.userService.getUserById(id);
    return user;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllUsers() {
    const allUsers = await this.userService.getAllUsers();
    return allUsers;
  }
}
