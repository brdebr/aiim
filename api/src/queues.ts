import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const BullQueuesModule = BullModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    redis: {
      host: configService.get<string>('REDIS_HOST'),
      port: +configService.get<number>('REDIS_PORT'),
      db: +configService.get<number>('REDIS_DB'),
    },
  }),
  inject: [ConfigService],
});
