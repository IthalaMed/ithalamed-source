export default () => ({
  // Application
  nodeEnv: process.env.NODE_ENV || 'development',
  port:  parseInt(process.env.AUTH_SERVICE_PORT || '4001', 10),
  appName: process.env.APP_NAME || 'IthalaMed Auth Service',

  // Database
  database: {
    host: process.env. AUTH_DB_HOST || 'localhost',
    port: parseInt(process.env.AUTH_DB_PORT || '5432', 10),
    username: process.env. AUTH_DB_USERNAME || 'ithalamed',
    password: process.env.AUTH_DB_PASSWORD || 'ithalamed_dev_password',
    database: process. env.AUTH_DB_NAME || 'ithalamed_auth',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env. REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || 'ithalamed_redis_password',
    db: parseInt(process.env. REDIS_DB || '0', 10),
  },

  // JWT
  jwt: {
    secret: process. env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-min-32-chars',
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'https://auth.ithalamed.com',
    audience: process.env.JWT_AUDIENCE || 'https://api.ithalamed.com',
  },

  // Encryption
  encryption: {
    key: process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key! ',
  },

  // Password policy
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
    saltRounds: 12,
  },

  // Account security
  security: {
    maxLoginAttempts: parseInt(process.env. MAX_LOGIN_ATTEMPTS || '5', 10),
    lockoutDurationMinutes: parseInt(process.env.LOCKOUT_DURATION_MINUTES || '30', 10),
    sessionTimeoutMinutes: parseInt(process. env.SESSION_TIMEOUT_MINUTES || '60', 10),
    maxActiveSessions: parseInt(process.env.MAX_ACTIVE_SESSIONS || '5', 10),
  },

  // OTP
  otp: {
    length: 6,
    expiryMinutes: 10,
    maxAttempts: 5,
    cooldownSeconds: 60,
  },

  // Rate limiting
  rateLimit: {
    ttl: parseInt(process.env. RATE_LIMIT_TTL || '60', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    authMax: parseInt(process.env. RATE_LIMIT_AUTH_MAX || '10', 10),
  },

  // CORS
  cors: {
    origins: process.env.CORS_ORIGINS || '*',
  },
});
