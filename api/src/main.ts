import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('BootstrapFunction');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3005;

  await app.listen(port);

  const prismaService = app.get(PrismaService);

  const imagesCount = await prismaService.imageObject.count();

  logger.log(`Listening on port: ${port}`);
  logger.log(`Environment: ${process.env.NODE_ENV}`);
  logger.log(`Application URL: ${await app.getUrl()}`);

  logger.log(`Number of images in database: ${imagesCount}`);
}
bootstrap();
