import { PrismaClient } from '.prisma/client';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(config: ConfigService) {
    const url = config.get<string>('DATABASE_URL');
    super({
      datasources: {
        db: {
          url,
        },
      },
    });
    this.logger.log(`Connecting to database:`);
    this.logger.log(`${url}`);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log(`Connected to MongoDB database 🍃`);
    } catch (error) {
      this.logger.error(`Error connecting to MongoDB database: ${error}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log(`Disconnected from database 👋`);
  }
}
