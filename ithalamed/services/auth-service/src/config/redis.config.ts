import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const redisConfig = (configService: ConfigService): Redis => {
  return new Redis({
    host: configService.get<string>('redis.host'),
    port: configService.get<number>('redis.port'),
    password: configService.get<string>('redis.password'),
    db: configService.get<number>('redis.db'),
    retryStrategy: (times:  number) => {
      return Math.min(times * 50, 2000);
    },
  });
};

export const REDIS_CLIENT = 'REDIS_CLIENT';
