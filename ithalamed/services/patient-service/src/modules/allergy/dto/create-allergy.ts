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

// Import enums from @ithalamed/common
import { AllergyType, AllergySeverity } from '@ithalamed/common';

/**
 * Create Allergy DTO
 */
export class CreateAllergyDto {
  @ApiProperty({ example:  'Penicillin', minLength: 2, maxLength:  200 })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  allergen: string;

  @ApiProperty({ enum: AllergyType, example: AllergyType. DRUG })
  @IsEnum(AllergyType)
  allergyType: AllergyType;

  @ApiProperty({ enum: AllergySeverity, example: AllergySeverity.SEVERE })
  @IsEnum(AllergySeverity)
  severity: AllergySeverity;

  @ApiPropertyOptional({ example: 'Rash, hives, difficulty breathing', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reaction?: string;

  @ApiPropertyOptional({ example: '2020-05-15', description: 'When allergy was first identified' })
  @IsOptional()
  @IsDateString()
  onsetDate?: string;

  @ApiPropertyOptional({ example: 'Confirmed by allergist testing', maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Provider ID who recorded this allergy' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  recordedBy?: string;
}
