import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entity from @ithalamed/database
import { PatientEmergencyContact } from '@ithalamed/database';

import { EmergencyContactController } from './emergency-contact.controller';
import { EmergencyContactService } from './emergency-contact.service';

@Module({
  imports:  [TypeOrmModule.forFeature([PatientEmergencyContact])],
  controllers: [EmergencyContactController],
  providers: [EmergencyContactService],
  exports: [EmergencyContactService],
})
export class EmergencyContactModule {}
