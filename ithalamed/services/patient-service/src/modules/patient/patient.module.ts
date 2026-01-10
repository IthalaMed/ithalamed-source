import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entity from @ithalamed/database
import { Patient } from '@ithalamed/database';

import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

@Module({
  imports:  [TypeOrmModule.forFeature([Patient])],
  controllers: [PatientController],
  providers:  [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
