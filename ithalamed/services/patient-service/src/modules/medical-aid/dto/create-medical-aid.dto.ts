import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Import from @ithalamed/common
import { MedicalAidScheme, DependentCode } from '@ithalamed/common';

/**
 * Create Medical Aid DTO
 * FR-PAT-005: Medical aid membership verification
 */
export class CreateMedicalAidDto {
  @ApiProperty({ enum: MedicalAidScheme, example: MedicalAidScheme.DISCOVERY })
  @IsEnum(MedicalAidScheme)
  scheme: MedicalAidScheme;

  @ApiProperty({ example: '12345678', minLength: 4, maxLength: 50 })
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  membershipNumber: string;

  @ApiProperty({ enum: DependentCode, example:  DependentCode.MAIN_MEMBER })
  @IsEnum(DependentCode)
  dependentCode: DependentCode;

  @ApiProperty({ example: 'Essential Saver', minLength: 2, maxLength: 100 })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  planName: string;

  @ApiPropertyOptional({ example: 'Executive', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  planType?: string;

  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'John Mbatha', description: 'Main member name if dependent' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  mainMemberName?: string;

  @ApiPropertyOptional({ example: '+27860123456', description: 'Medical aid contact number' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactNumber?: string;
}
