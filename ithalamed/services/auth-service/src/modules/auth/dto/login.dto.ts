import {
  IsString,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeviceInfoDto } from './register.dto';

/**
 * Login DTO
 * Implements FR-PAT-001 (Multi-method authentication)
 */
export class LoginDto {
  @ApiProperty({
    description: 'Email or phone number',
    example: '+27821234567',
  })
  @IsString()
  identifier: string;

  @ApiProperty({
    description: 'Password',
    example: 'SecureP@ss123',
  })
  @IsString()
  password: string;

  @ApiPropertyOptional({
    description: 'Remember me (extends token expiry)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;

  @ApiPropertyOptional({
    description: 'Device information',
    type:  DeviceInfoDto,
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
  @IsString()
  userId: string;

  @ApiProperty({
    description: '4-6 digit PIN',
    example:  '1234',
  })
  @IsString()
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
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Biometric signature/token',
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
