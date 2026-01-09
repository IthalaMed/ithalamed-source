import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User, Session, RefreshToken, Otp } from '@ithalamed/database';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('database.host'),
  port: configService.get<number>('database.port'),
  username: configService.get<string>('database.username'),
  password: configService.get<string>('database.password'),
  database: configService.get<string>('database.database'),
  entities: [User, Session, RefreshToken, Otp],
  synchronize: configService.get<boolean>('database.synchronize', false),
  logging: configService.get<boolean>('database. logging', false),
  ssl: configService.get<string>('nodeEnv') === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
  extra: {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
});
