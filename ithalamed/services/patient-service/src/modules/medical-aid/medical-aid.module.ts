import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entity from @ithalamed/database
import { PatientMedicalAid } from '@ithalamed/database';

import { MedicalAidController } from './medical-aid.controller';
import { MedicalAidService } from './medical-aid. service';

@Module({
  imports: [TypeOrmModule.forFeature([PatientMedicalAid])],
  controllers: [MedicalAidController],
  providers: [MedicalAidService],
  exports: [MedicalAidService],
})
export class MedicalAidModule {}
