import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChronicConditionStatus, ChronicConditionSeverity } from '@ithalamed/common';

/**
 * Chronic Condition Response DTO
 */
export class ChronicConditionResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  patientId: string;

  @ApiProperty({ example: 'Hypertension' })
  conditionName: string;

  @ApiPropertyOptional({ example: 'I10' })
  icd10Code?: string;

  @ApiProperty({ enum: ChronicConditionStatus })
  status: ChronicConditionStatus;

  @ApiPropertyOptional({ enum: ChronicConditionSeverity })
  severity?: ChronicConditionSeverity;

  @ApiPropertyOptional()
  diagnosisDate?: Date;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  currentTreatment?: string;

  @ApiPropertyOptional()
  diagnosedBy?: string;

  @ApiPropertyOptional()
  resolutionDate?: Date;

  @ApiProperty()
  isActive:  boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
