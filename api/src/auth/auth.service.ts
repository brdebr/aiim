import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export type JwtPayload = {
  id: string;
  email: string;
  name?: string;
  role: string;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private logger = new Logger(AuthService.name);

  async validateUser(
    email: string,
    password: string,
  ): Promise<JwtPayload | null> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isPasswordCorrect = await this.userService.validatePassword(
      password,
      user.password,
    );

    if (!user || !isPasswordCorrect) {
      throw new ForbiddenException('Invalid credentials');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'user',
    };
  }

  async generateJwt(email: string) {
    const user = await this.userService.getUserByEmail(email);
    this.logger.log(
      `Generating JWT for user "${user.email}": "${user.name}" - "${user.id}"`,
    );
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'user',
    };
    return this.jwtService.sign(payload);
  }

  decodeJwt(bearerToken: string) {
    const decoded = this.jwtService.decode(bearerToken.replace('Bearer ', ''), {
      json: true,
    });
    return decoded as Record<string, unknown>;
  }

  async buildCurrentLoginInfo(bearerToken: string) {
    const jwt = this.decodeJwt(bearerToken) as JwtPayload & {
      exp: number;
      iat: number;
    };
    if (!jwt) throw new UnauthorizedException();
    const user = await this.userService.getUserById(jwt.id);
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
      iat: jwt.iat * 1000,
      exp: jwt.exp * 1000,
      issuedAt,
      expiresAt,
      expiresIn,
      isAboutToExpire,
    };
  }
}
