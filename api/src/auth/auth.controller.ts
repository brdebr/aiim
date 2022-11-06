import { UserService } from './../user/user.service';
import { LoginDto, SignUpDto } from './dto/loginDto';
import { AuthService } from './auth.service';
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';

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

  @Post('login')
  async login(@Body() loginDTO: LoginDto): Promise<string> {
    const { email, password } = loginDTO;
    const valid = await this.authService.validateUser(email, password);
    if (!valid) {
      throw new UnauthorizedException();
    }
    return await this.authService.generateJwt(email);
  }
}
