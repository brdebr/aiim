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
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

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
    return {
      token: await this.authService.generateJwt(email),
      payload: userValidate,
    };
  }

  @Get('current')
  async getCurrentAuth(
    @Headers('Authorization') bearerToken: string,
    @JwtObject() loginInfo: JwtPayload,
  ) {
    const jwt = this.authService.decodeJwt(bearerToken) as {
      exp: number;
      iat: number;
    };
    if (!jwt) throw new UnauthorizedException();
    const user = await this.userService.getUserById(loginInfo.id);
    const issuedAt = new Date(jwt.iat * 1000);
    const expiresAt = new Date(jwt.exp * 1000);
    const isAboutToExpire = dayjs(
      dayjs(expiresAt).subtract(1, 'hour'),
    ).isBefore(Date.now());
    const expiresIn = `${dayjs(expiresAt).fromNow(true)} (${dayjs(expiresAt)
      .diff(dayjs(), 'minute', true)
      .toFixed(2)} minutes)`;

    return {
      ...user,
      ...jwt,
      issuedAt,
      expiresAt,
      expiresIn,
      isAboutToExpire,
    };
  }
}
