import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';

// Import from centralized common package - NO LOCAL DUPLICATES
import { HttpExceptionFilter, LoggingInterceptor, TransformInterceptor } from '@ithalamed/common';

async function bootstrap() {
  const logger = new Logger('PatientService');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port');
  const apiPrefix = configService. get<string>('app.apiPrefix');
  const nodeEnv = configService.get<string>('app. nodeEnv');
  const corsOrigins = configService.get<string[]>('cors.origins');

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  });

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters and interceptors from @ithalamed/common
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());

  // Swagger documentation
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('IthalaMed Patient Service')
      .setDescription('Patient management, medical records, and health data API')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('health', 'Health check endpoints')
      .addTag('patients', 'Patient profile management')
      .addTag('allergies', 'Patient allergies')
      .addTag('chronic-conditions', 'Chronic conditions')
      .addTag('emergency-contacts', 'Emergency contacts')
      .addTag('medical-aid', 'Medical aid/insurance')
      .addTag('consents', 'Patient consents (POPIA/GDPR)')
      .addTag('documents', 'Patient documents')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(port);

  logger.log(`🏥 Patient Service running on:  http://localhost:${port}`);
  logger.log(`📚 API Docs: http://localhost:${port}/docs`);
  logger.log(`🔧 Environment: ${nodeEnv}`);
}

bootstrap();
