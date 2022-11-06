import { ForbiddenException, Injectable } from '@nestjs/common';
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

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.userService.getUserByEmail(email);

    const isPasswordCorrect = await this.userService.comparePassword(
      password,
      user.password,
    );

    if (!user || !isPasswordCorrect) {
      throw new ForbiddenException('Invalid credentials');
    }
    return true;
  }

  async generateJwt(email: string) {
    const user = await this.userService.getUserByEmail(email);
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'user',
    };
    return this.jwtService.sign(payload);
  }
}
