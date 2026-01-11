import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entity from @ithalamed/database
import { PatientConsent } from '@ithalamed/database';

import { ConsentController } from './consent.controller';
import { ConsentService } from './consent.service';

@Module({
  imports:  [TypeOrmModule.forFeature([PatientConsent])],
  controllers: [ConsentController],
  providers: [ConsentService],
  exports: [ConsentService],
})
export class ConsentModule {}
