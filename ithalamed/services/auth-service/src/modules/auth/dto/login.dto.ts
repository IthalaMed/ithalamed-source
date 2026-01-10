import {
  IsString,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsUUID,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeviceInfoDto } from './register.dto';

/**
 * Login with email/phone and password DTO
 * Implements FR-PAT-001 (Multi-method authentication)
 */
export class LoginDto {
  @ApiProperty({
    description: 'Email address or phone number',
    example: '+27821234567',
  })
  @IsString({ message: 'Identifier is required' })
  identifier: string;

  @ApiProperty({
    description: 'Password',
    example: 'SecureP@ss123',
  })
  @IsString({ message: 'Password is required' })
  password: string;

  @ApiPropertyOptional({
    description: 'Remember this device (extends session)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;

  @ApiPropertyOptional({
    description: 'Device information for session tracking',
    type: DeviceInfoDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  deviceInfo?: DeviceInfoDto;
}

/**
 * Login with PIN DTO
 */
export class LoginWithPinDto {
  @ApiProperty({
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'Invalid user ID format' })
  userId: string;

  @ApiProperty({
    description: '4-6 digit PIN',
    example:  '1234',
  })
  @IsString()
  @Matches(/^\d{4,6}$/, { message: 'PIN must be 4-6 digits' })
  pin: string;

  @ApiPropertyOptional({
    description: 'Device information',
    type: DeviceInfoDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  deviceInfo?: DeviceInfoDto;
}

/**
 * Login with biometric DTO
 */
export class LoginWithBiometricDto {
  @ApiProperty({
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'Invalid user ID format' })
  userId: string;

  @ApiProperty({
    description: 'Biometric authentication token/signature',
  })
  @IsString()
  biometricToken: string;

  @ApiPropertyOptional({
    description: 'Device information',
    type: DeviceInfoDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DeviceInfoDto)
  deviceInfo?: DeviceInfoDto;
}
