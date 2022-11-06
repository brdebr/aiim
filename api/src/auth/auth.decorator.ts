import { JwtPayload } from './auth.service';
import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';

export const JwtObject = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): Partial<JwtPayload> => {
    try {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    } catch (error) {
      throw new ForbiddenException();
    }
  },
);

export const Public = () => SetMetadata('isPublic', true);
