import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  MinLength,
  MaxLength,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserType } from '@ithalamed/common';

/**
 * Device information for registration
 */
export class DeviceInfoDto {
  @ApiPropertyOptional({ description: 'Unique device identifier' })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiPropertyOptional({ description: 'Device type (mobile, tablet, desktop)' })
  @IsOptional()
  @IsString()
  deviceType?: string;

  @ApiPropertyOptional({ description: 'Device name' })
  @IsOptional()
  @IsString()
  deviceName?: string;

  @ApiPropertyOptional({ description:  'Platform (ios, android, web)' })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiPropertyOptional({ description:  'App version' })
  @IsOptional()
  @IsString()
  appVersion?: string;
}

/**
 * Register new user DTO
 * Implements FR-PAT-001 (Registration Flow)
 */
export class RegisterDto {
  @ApiProperty({ 
    description: 'First name',
    example: 'Thandi',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message: 'First name can only contain letters, spaces, hyphens and apostrophes',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Mbatha',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message: 'Last name can only contain letters, spaces, hyphens and apostrophes',
  })
  lastName: string;

  @ApiProperty({
    description: 'Phone number in E.164 format',
    example: '+27821234567',
  })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in E.164 format (e.g., +27821234567)',
  })
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'thandi@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(255)
  email?: string;

  @ApiProperty({
    description: 'Password (min 8 chars, must include uppercase, lowercase, number, special char)',
    example: 'SecureP@ss123',
    minLength: 8,
    maxLength: 128,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$! %*?&]/,
    {
      message:  'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  @ApiProperty({
    description: 'User type',
    enum: UserType,
    example: UserType.PATIENT,
  })
  @IsEnum(UserType)
  userType: UserType;

  @ApiPropertyOptional({
    description: 'Preferred language (ISO 639-1)',
    example: 'en',
    default: 'en',
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  preferredLanguage?: string;

  @ApiProperty({
    description: 'Terms of service accepted',
    example: true,
  })
  @IsBoolean()
  termsAccepted: boolean;

  @ApiProperty({
    description: 'Privacy policy accepted',
    example: true,
  })
  @IsBoolean()
  privacyAccepted: boolean;

  @ApiPropertyOptional({
    description: 'Device information',
    type:  DeviceInfoDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  deviceInfo?: DeviceInfoDto;
}
