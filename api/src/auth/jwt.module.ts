import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationModule } from 'src/config';

export const JwtNestModule = JwtModule.registerAsync({
  imports: [ConfigurationModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: configService.get<string>('JWT_EXPIRE_TIME') },
  }),
});
