import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entity from @ithalamed/database
import { PatientDocument } from '@ithalamed/database';

import { DocumentController } from './document. controller';
import { DocumentService } from './document.service';

@Module({
  imports: [TypeOrmModule.forFeature([PatientDocument])],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
