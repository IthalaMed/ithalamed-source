import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  ValidateNested,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { Gender, BloodType } from '@ithalamed/common';
import { AddressDto } from './address.dto';

/**
 * Update Patient DTO
 * All fields optional for partial updates
 */
export class UpdatePatientDto {
  @ApiPropertyOptional({ example: 'Thandi', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Grace', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  middleName?: string;

  @ApiPropertyOptional({ example: 'Mbatha', maxLength:  100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ enum: BloodType })
  @IsOptional()
  @IsEnum(BloodType)
  bloodType?: BloodType;

  @ApiPropertyOptional({ example: '+27821234567' })
  @IsOptional()
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in E. 164 format',
  })
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'thandi@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ type: AddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @ApiPropertyOptional({ example: 'en', maxLength: 10 })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  preferredLanguage?: string;

  @ApiPropertyOptional({ example: 'Zulu', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ethnicity?: string;

  @ApiPropertyOptional({ example: 'Christian', maxLength:  50 })
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

  @ApiPropertyOptional({ example: 'TechCorp Ltd', maxLength:  100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  employer?: string;

  @ApiPropertyOptional({ description: 'Profile photo URL' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  profilePhotoUrl?: string;
}
