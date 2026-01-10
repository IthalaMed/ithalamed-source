import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// Guards from @ithalamed/common
import { JwtAuthGuard, RolesGuard } from '@ithalamed/common';

// Entities from @ithalamed/database
import {
  Patient,
  PatientAllergy,
  PatientChronicCondition,
  PatientEmergencyContact,
  PatientMedicalAid,
  PatientConsent,
  PatientDocument,
} from '@ithalamed/database';

// Configuration
import { configuration } from './config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { PatientModule } from './modules/patient/patient.module';
import { AllergyModule } from './modules/allergy/allergy.module';
import { ChronicConditionModule } from './modules/chronic-condition/chronic-condition.module';
import { EmergencyContactModule } from './modules/emergency-contact/emergency-contact.module';
import { MedicalAidModule } from './modules/medical-aid/medical-aid.module';
import { ConsentModule } from './modules/consent/consent.module';
import { DocumentModule } from './modules/document/document.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports:  [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        schema: configService.get<string>('database.schema'),
        entities: [
          Patient,
          PatientAllergy,
          PatientChronicCondition,
          PatientEmergencyContact,
          PatientMedicalAid,
          PatientConsent,
          PatientDocument,
        ],
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
      }),
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory:  (configService: ConfigService) => [
        {
          name: 'short',
          ttl: 1000,
          limit: 10,
        },
        {
          name: 'long',
          ttl: configService.get<number>('throttle.ttl') * 1000,
          limit:  configService.get<number>('throttle.limit'),
        },
      ],
    }),

    // Auth (JWT validation only)
    AuthModule,

    // Feature modules
    PatientModule,
    AllergyModule,
    ChronicConditionModule,
    EmergencyContactModule,
    MedicalAidModule,
    ConsentModule,
    DocumentModule,
    HealthModule,
  ],
  providers: [
    // Global guards (order matters:  Throttler -> JWT -> Roles)
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide:  APP_GUARD, useClass:  RolesGuard },
  ],
})
export class AppModule {}
