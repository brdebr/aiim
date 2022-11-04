import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ImageObjectModule } from './image-object/image-object.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./.env.dev', './.env'],
    }),
    PrismaModule,
    ImageObjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
