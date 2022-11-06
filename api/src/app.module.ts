import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ImageObjectModule } from './image-object/image-object.module';
import { VoteModule } from './vote/vote.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GlobalJwtGuardProvider } from './auth/jwt.guard';
import { ConfigurationModule } from './config';

@Module({
  imports: [
    ConfigurationModule,
    PrismaModule,
    UserModule,
    AuthModule,
    ImageObjectModule,
    VoteModule,
  ],
  controllers: [],
  providers: [GlobalJwtGuardProvider],
})
export class AppModule {}
