import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import {
  Patient,
  PatientAllergy,
  PatientChronicCondition,
  PatientEmergencyContact,
  PatientMedicalAid,
  PatientDocument,
  PatientConsent,
  Guardian,
} from '@ithalamed/database';

import { PatientModule } from './modules/patient/patient.module';
import { AllergyModule } from './modules/allergy/allergy.module';
import { ChronicConditionModule } from './modules/chronic-condition/chronic-condition.module';
import { EmergencyContactModule } from './modules/emergency-contact/emergency-contact.module';
import { MedicalAidModule } from './modules/medical-aid/medical-aid.module';
import { DocumentModule } from './modules/document/document.module';
import { ConsentModule } from './modules/consent/consent.module';
import { GuardianModule } from './modules/guardian/guardian.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';

import databaseConfig from './config/database.config';
import appConfig from './config/app.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env. local', '.env'],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory:  (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        schema: configService.get<string>('database.schema') || 'patient',
        entities: [
          Patient,
          PatientAllergy,
          PatientChronicCondition,
          PatientEmergencyContact,
          PatientMedicalAid,
          PatientDocument,
          PatientConsent,
          Guardian,
        ],
        synchronize:  configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
        ssl: configService.get<string>('NODE_ENV') === 'production' 
          ? { rejectUnauthorized: false } 
          : false,
      }),
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      inject:  [ConfigService],
      useFactory: (configService: ConfigService) => ([{
        ttl: configService. get<number>('THROTTLE_TTL') || 60,
        limit:  configService.get<number>('THROTTLE_LIMIT') || 100,
      }]),
    }),

    // Feature modules
    AuthModule,
    PatientModule,
    AllergyModule,
    ChronicConditionModule,
    EmergencyContactModule,
    MedicalAidModule,
    DocumentModule,
    ConsentModule,
    GuardianModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
