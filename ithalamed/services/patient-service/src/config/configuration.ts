export default () => ({
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port:  parseInt(process.env.PORT || '3002', 10),
    apiPrefix: process.env. API_PREFIX || 'api/v1',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env. DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'ithalamed',
    schema: process.env.DB_SCHEMA || 'patient',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
  },
  throttle: {
    ttl:  parseInt(process.env.THROTTLE_TTL || '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
  },
  cors: {
    origins: process. env.CORS_ORIGINS?. split(',') || ['http://localhost:3000'],
  },
});
