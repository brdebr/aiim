import { ConfigModule } from '@nestjs/config';

export const ConfigurationModule = ConfigModule.forRoot({
  isGlobal: true,
  expandVariables: true,
  envFilePath: ['../.env.dev', '../.env', './.env'],
});
