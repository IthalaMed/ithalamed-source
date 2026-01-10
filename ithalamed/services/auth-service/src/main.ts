import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';

// Import from centralized common package
import {
  HttpExceptionFilter,
  LoggingInterceptor,
  TransformInterceptor,
} from '@ithalamed/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());

  // CORS
  const corsOrigins = configService.get<string>('CORS_ORIGINS')?.split(',') || ['http://localhost:3000'];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix(configService.get<string>('API_PREFIX') || 'api/v1');

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform:  true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters and interceptors from @ithalamed/common
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Swagger
  if (configService.get<string>('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('IthalaMed Auth Service')
      .setDescription('Authentication and Authorization API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);

  console.log(`🚀 Auth Service running on:  http://localhost:${port}`);
}

bootstrap();
