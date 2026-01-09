import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  access: {
    secret: process.env. JWT_ACCESS_SECRET || 'default-access-secret-change-me!',
    expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
  },
  refresh: {
    secret: process. env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-me!',
    expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
}));
