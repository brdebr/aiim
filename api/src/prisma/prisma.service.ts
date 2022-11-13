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
          url: process.env.DATABASE_URL || url,
        },
      },
    });
    this.logger.log(`Using database:`);
    this.logger.log(`${url}`);
  }

  async onModuleInit() {
    let retries = 5;
    while (retries) {
      try {
        this.logger.log(`Connecting to MongoDB database...`);
        await this.$connect();
        this.logger.log(`Connected to MongoDB database 🍃`);
        break;
      } catch (error) {
        this.logger.error(`Error connecting to MongoDB database: ${error}`);
        this.logger.error(`Retrying in 1 second...`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      retries--;
      this.logger.error(`Retries left: ${retries}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log(`Disconnected from database 👋`);
  }
}
