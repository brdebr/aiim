import { UserService } from './../user/user.service';
import { LoginDto, SignUpDto } from './dto/authDto';
import { AuthService, JwtPayload } from './auth.service';
import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  Headers,
  Logger,
  Get,
} from '@nestjs/common';
import { JwtObject, Public } from './auth.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  private logger = new Logger(AuthController.name);

  @Public()
  @Post('signup')
  async signUp(@Body() body: SignUpDto, @Headers('sign-pass') signPassHeader) {
    const signPass = this.configService.get<string>('SIGN_PASS');
    const userExists = await this.userService.getUserByEmail(body.email);
    this.logger.log(`Signup user: "${body.email}" - "${signPass}"`);
    if (userExists || signPassHeader !== signPass) {
      throw new UnauthorizedException();
    }
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
    this.logger.log(`Logging User: "${email}"`);
    const userValidate = await this.authService.validateUser(email, password);
    if (!userValidate) {
      throw new UnauthorizedException();
    }
    const token = await this.authService.generateJwt(email);
    const info = await this.authService.buildCurrentLoginInfo(token);
    return {
      token,
      info,
    };
  }

  @Get('current')
  async getCurrentAuth(@Headers('Authorization') bearerToken: string) {
    return this.authService.buildCurrentLoginInfo(bearerToken);
  }
}
