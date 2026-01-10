import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
  ValidateNested,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Import enums from @ithalamed/common
import { Gender, BloodType, IdType } from '@ithalamed/common';

import { AddressDto } from './address.dto';

/**
 * Create Patient DTO
 * FR-PAT-001: Patient registration
 */
export class CreatePatientDto {
  @ApiPropertyOptional({
    description: 'User ID from auth service (if linked to user account)',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4')
  userId?: string;

  @ApiProperty({ example: 'Thandi', minLength: 2, maxLength:  100 })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message:  'First name can only contain letters, spaces, hyphens, and apostrophes',
  })
  firstName: string;

  @ApiPropertyOptional({ example: 'Grace', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  middleName?: string;

  @ApiProperty({ example: 'Mbatha', minLength: 2, maxLength: 100 })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message: 'Last name can only contain letters, spaces, hyphens, and apostrophes',
  })
  lastName: string;

  @ApiProperty({
    example: '8501156789012',
    description: 'SA ID number or passport number',
    minLength: 6,
    maxLength: 20,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  idNumber: string;

  @ApiProperty({ enum: IdType, example: IdType.SA_ID, default: IdType.SA_ID })
  @IsEnum(IdType)
  idType: IdType;

  @ApiProperty({ example: '1985-01-15', description: 'Date of birth (YYYY-MM-DD)' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ enum: Gender, example: Gender. FEMALE })
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional({ enum: BloodType, example: BloodType.O_POSITIVE })
  @IsOptional()
  @IsEnum(BloodType)
  bloodType?: BloodType;

  @ApiProperty({ example: '+27821234567', description: 'Phone in E.164 format' })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in E.164 format (e.g., +27821234567)',
  })
  phoneNumber: string;

  @ApiPropertyOptional({ example: 'thandi@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiProperty({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiPropertyOptional({ example: 'en', default: 'en', maxLength: 10 })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  preferredLanguage?: string;

  @ApiPropertyOptional({ example: 'Zulu', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ethnicity?: string;

  @ApiPropertyOptional({ example: 'Christian', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  religion?: string;

  @ApiPropertyOptional({ example: 'Married', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  maritalStatus?: string;

  @ApiPropertyOptional({ example: 'Software Developer', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  occupation?: string;

  @ApiPropertyOptional({ example: 'TechCorp Ltd', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  employer?: string;
}
