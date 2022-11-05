import { Controller, Post } from '@nestjs/common';

@Controller()
export class UserController {
  @Post('auth/signup')
  signUp() {
    return 'signup';
  }
}
