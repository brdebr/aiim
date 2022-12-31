import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ImageObjectModule } from './image-object/image-object.module';
import { VoteModule } from './vote/vote.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GlobalJwtGuardProvider } from './auth/jwt.guard';
import { ConfigurationModule } from './config';
import { ImageGenerationModule } from './image-generation/image-generation.module';
import { BullQueuesModule } from './queues';
import { EventEmitter } from './events';
import { SdConfigModule } from './sd-config/sd-config.module';

@Module({
  imports: [
    ConfigurationModule,
    PrismaModule,
    UserModule,
    AuthModule,
    ImageObjectModule,
    VoteModule,
    ImageGenerationModule,
    BullQueuesModule,
    EventEmitter,
    SdConfigModule,
  ],
  controllers: [],
  providers: [GlobalJwtGuardProvider],
})
export class AppModule {}
