import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const BullQueuesModule = BullModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    redis: {
      host: configService.get<string>('QUEUE_HOST'),
      port: +configService.get<number>('QUEUE_PORT'),
      db: +configService.get<number>('QUEUE_DB'),
    },
  }),
  inject: [ConfigService],
});
