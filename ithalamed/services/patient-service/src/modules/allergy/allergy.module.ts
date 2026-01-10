import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entity from @ithalamed/database
import { PatientAllergy } from '@ithalamed/database';

import { AllergyController } from './allergy.controller';
import { AllergyService } from './allergy.service';

@Module({
  imports: [TypeOrmModule.forFeature([PatientAllergy])],
  controllers: [AllergyController],
  providers: [AllergyService],
  exports: [AllergyService],
})
export class AllergyModule {}
