import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entity from @ithalamed/database
import { PatientChronicCondition } from '@ithalamed/database';

import { ChronicConditionController } from './chronic-condition.controller';
import { ChronicConditionService } from './chronic-condition. service';

@Module({
  imports: [TypeOrmModule. forFeature([PatientChronicCondition])],
  controllers: [ChronicConditionController],
  providers: [ChronicConditionService],
  exports: [ChronicConditionService],
})
export class ChronicConditionModule {}
