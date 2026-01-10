import { IsString, IsEnum, Length, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OtpPurpose } from '@ithalamed/common';

/**
 * Send OTP Request DTO
 */
export class SendOtpDto {
  @ApiProperty({
    description: 'Email or phone number to send OTP to',
    example: '+27821234567',
  })
  @IsString()
  identifier: string;

  @ApiProperty({
    description: 'Purpose of the OTP',
    enum: OtpPurpose,
    example: OtpPurpose.PHONE_VERIFICATION,
  })
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;

  @ApiPropertyOptional({
    description: 'User ID (required for some purposes)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

/**
 * Verify OTP Request DTO
 */
export class VerifyOtpDto {
  @ApiProperty({
    description: 'Email or phone number the OTP was sent to',
    example: '+27821234567',
  })
  @IsString()
  identifier: string;

  @ApiProperty({
    description: '6-digit OTP code',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  code: string;

  @ApiProperty({
    description: 'Purpose of the OTP verification',
    enum: OtpPurpose,
    example:  OtpPurpose. PHONE_VERIFICATION,
  })
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;
}

/**
 * Resend OTP Request DTO
 */
export class ResendOtpDto {
  @ApiProperty({
    description:  'Email or phone number to resend OTP to',
    example: '+27821234567',
  })
  @IsString()
  identifier: string;

  @ApiProperty({
    description: 'Purpose of the OTP',
    enum: OtpPurpose,
    example: OtpPurpose.PHONE_VERIFICATION,
  })
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;
}
