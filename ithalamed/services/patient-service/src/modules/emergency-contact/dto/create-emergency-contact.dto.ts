import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Import from @ithalamed/common
import { Relationship } from '@ithalamed/common';

/**
 * Create Emergency Contact DTO
 * FR-PAT-006:  Minimum 2 emergency contacts required
 */
export class CreateEmergencyContactDto {
  @ApiProperty({ example: 'John', minLength: 2, maxLength:  100 })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Mbatha', minLength: 2, maxLength: 100 })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ enum: Relationship, example:  Relationship.SPOUSE })
  @IsEnum(Relationship)
  relationship: Relationship;

  @ApiProperty({ example: '+27829876543', description: 'Primary phone in E.164 format' })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in E.164 format',
  })
  phoneNumber: string;

  @ApiPropertyOptional({ example: '+27119876543', description: 'Alternative phone' })
  @IsOptional()
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in E.164 format',
  })
  alternativePhone?: string;

  @ApiPropertyOptional({ example: 'john.mbatha@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiProperty({ example: 1, description: 'Contact priority (1 = primary)', minimum: 1, maximum: 10 })
  @IsInt()
  @Min(1)
  @Max(10)
  priority: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'Available 24/7, lives nearby', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
