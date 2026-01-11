import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Import from @ithalamed/common
import { ChronicConditionStatus, ChronicConditionSeverity } from '@ithalamed/common';

/**
 * Create Chronic Condition DTO
 */
export class CreateChronicConditionDto {
  @ApiProperty({ example: 'Hypertension', minLength: 2, maxLength: 200 })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  conditionName: string;

  @ApiPropertyOptional({ example: 'I10', description: 'ICD-10 code', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  icd10Code?: string;

  @ApiProperty({ 
    enum: ChronicConditionStatus, 
    example: ChronicConditionStatus. ACTIVE,
    default: ChronicConditionStatus. ACTIVE,
  })
  @IsEnum(ChronicConditionStatus)
  status: ChronicConditionStatus;

  @ApiPropertyOptional({ enum: ChronicConditionSeverity })
  @IsOptional()
  @IsEnum(ChronicConditionSeverity)
  severity?: ChronicConditionSeverity;

  @ApiPropertyOptional({ example: '2020-03-15', description: 'Date of diagnosis' })
  @IsOptional()
  @IsDateString()
  diagnosisDate?: string;

  @ApiPropertyOptional({ example: 'Stage 2 hypertension, well controlled', maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiPropertyOptional({ example: 'Amlodipine 5mg daily', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  currentTreatment?: string;

  @ApiPropertyOptional({ description: 'Provider who diagnosed', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  diagnosedBy?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
