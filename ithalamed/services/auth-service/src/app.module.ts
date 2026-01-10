import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

// Config
import { authConfig, jwtConfig, databaseConfig } from './config';

// Entities
import { User, Session, RefreshToken, Otp, AuditLog } from '@ithalamed/database';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { OtpModule } from './modules/otp/otp.module';
import { SessionModule } from './modules/session/session.module';
import { AuditModule } from './modules/audit/audit.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, jwtConfig, databaseConfig],
      envFilePath: ['.env. local', '.env'],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      inject:  [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ... configService.get('database'),
        entities: [User, Session, RefreshToken, Otp, AuditLog],
      }),
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory:  (configService: ConfigService) => ([{
        ttl: configService. get<number>('THROTTLE_TTL') || 60,
        limit: configService.get<number>('THROTTLE_LIMIT') || 10,
      }]),
    }),

    // Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.access.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.access. expiresIn'),
        },
      }),
    }),

    // Feature modules
    AuthModule,
    UserModule,
    OtpModule,
    SessionModule,
    AuditModule,
    HealthModule,
  ],
})
export class AppModule {}
