import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('BootstrapFunction');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3005;

  await app.listen(port);

  logger.log(`Listening on port: ${port}`);
  logger.log(`Environment: ${process.env.NODE_ENV}`);
  logger.log(`Application URL: ${await app.getUrl()}`);
}
bootstrap();
