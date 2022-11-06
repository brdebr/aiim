import { JwtPayload } from './../auth/auth.service';
import { UserService } from './user.service';
import { Controller, Get } from '@nestjs/common';
import { JwtObject } from 'src/auth/auth.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getCurrentUser(@JwtObject() logInfo: JwtPayload) {
    const user = await this.userService.getUserById(logInfo.id);
    return user;
  }

  @Get()
  async getAllUsers() {
    const allUsers = await this.userService.getAllUsers();
    return allUsers;
  }
}
