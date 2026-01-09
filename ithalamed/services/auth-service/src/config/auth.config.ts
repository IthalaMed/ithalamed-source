import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
  lockoutDurationMinutes: parseInt(process.env. LOCKOUT_DURATION_MINUTES || '30', 10),
  
  otp: {
    expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10),
    maxAttempts: parseInt(process.env. OTP_MAX_ATTEMPTS || '5', 10),
    length: 6,
  },
  
  session: {
    maxActiveSessions: parseInt(process.env.MAX_ACTIVE_SESSIONS || '5', 10),
  },
  
  encryption: {
    key: process.env. ENCRYPTION_KEY || 'default-encryption-key-change-me! ',
  },
}));
