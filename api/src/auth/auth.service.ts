import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

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
    this.logger.log(`Validating user "${email}"`);
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
}
