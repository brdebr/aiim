import { UserService } from './../user/user.service';
import { LoginDto, SignUpDto } from './dto/authDto';
import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { Public } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('signup')
  async signUp(@Body() body: SignUpDto) {
    const userCreated = await this.userService.create(
      body.email,
      body.password,
      body.name,
    );
    return userCreated;
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDTO: LoginDto) {
    const { email, password } = loginDTO;
    const userValidate = await this.authService.validateUser(email, password);
    if (!userValidate) {
      throw new UnauthorizedException();
    }
    return {
      token: await this.authService.generateJwt(email),
      payload: userValidate,
    };
  }
}
