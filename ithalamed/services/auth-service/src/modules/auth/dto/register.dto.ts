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
 * Device information for registration/login
 */
export class DeviceInfoDto {
  @ApiPropertyOptional({ description: 'Unique device identifier' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  deviceId?: string;

  @ApiPropertyOptional({ 
    description: 'Device type',
    example: 'mobile',
    enum: ['mobile', 'tablet', 'desktop', 'unknown'],
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  deviceType?: string;

  @ApiPropertyOptional({ description: 'Device name', example: 'iPhone 14 Pro' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  deviceName?: string;

  @ApiPropertyOptional({ 
    description: 'Platform/OS',
    example: 'ios',
    enum: ['ios', 'android', 'web', 'windows', 'macos', 'linux'],
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  platform?: string;

  @ApiPropertyOptional({ description: 'App version', example: '1.0.0' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  appVersion?: string;

  @ApiPropertyOptional({ description: 'OS version', example: '17.0' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  osVersion?: string;
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
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  @MaxLength(100, { message: 'First name must not exceed 100 characters' })
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
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  @MaxLength(100, { message: 'Last name must not exceed 100 characters' })
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
    message: 'Phone number must be in E.164 format (e. g., +27821234567)',
  })
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'thandi@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message:  'Please provide a valid email address' })
  @MaxLength(255)
  email?: string;

  @ApiProperty({
    description: 'Password (min 8 chars, must include uppercase, lowercase, number, special char)',
    example: 'SecureP@ss123',
    minLength: 8,
    maxLength: 128,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$! %*?&]/,
    {
      message: 
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
    },
  )
  password: string;

  @ApiProperty({
    description: 'User type',
    enum: UserType,
    example: UserType.PATIENT,
  })
  @IsEnum(UserType, { message: 'Invalid user type' })
  userType: UserType;

  @ApiPropertyOptional({
    description:  'Preferred language (ISO 639-1 code)',
    example: 'en',
    default: 'en',
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  preferredLanguage?:  string;

  @ApiProperty({
    description: 'User accepts terms of service',
    example: true,
  })
  @IsBoolean({ message: 'Terms acceptance must be a boolean' })
  termsAccepted: boolean;

  @ApiProperty({
    description: 'User accepts privacy policy',
    example:  true,
  })
  @IsBoolean({ message: 'Privacy acceptance must be a boolean' })
  privacyAccepted: boolean;

  @ApiPropertyOptional({
    description: 'Device information',
    type: DeviceInfoDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  deviceInfo?: DeviceInfoDto;
}
