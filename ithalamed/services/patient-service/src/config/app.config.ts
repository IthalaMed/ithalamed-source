import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port:  parseInt(process.env.PORT || '3002', 10),
  apiPrefix: process.env. API_PREFIX || 'api/v1',
  
  // JWT configuration (for token validation)
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn:  process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  },

  // Auth service URL
  authServiceUrl:  process.env.AUTH_SERVICE_URL || 'http://localhost:3001',

  // Encryption
  encryption: {
    key:  process.env.ENCRYPTION_KEY,
  },

  // File storage
  storage: {
    type: process. env.STORAGE_TYPE || 'local',
    localPath: process.env.STORAGE_LOCAL_PATH || './uploads',
    s3: {
      region: process.env.AWS_REGION,
      bucket: process.env. AWS_S3_BUCKET,
      accessKeyId: process. env.AWS_ACCESS_KEY_ID,
      secretAccessKey:  process.env.AWS_SECRET_ACCESS_KEY,
    },
  },

  // Patient number generation
  patientNumber: {
    prefix: 'PT',
    yearFormat: true,
    padding: 8,
  },
}));
