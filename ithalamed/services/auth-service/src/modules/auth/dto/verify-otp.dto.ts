import { IsString, IsEnum, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OtpPurpose } from '@ithalamed/common';

/**
 * Send OTP DTO
 */
export class SendOtpDto {
  @ApiProperty({
    description: 'Email or phone number',
    example: '+27821234567',
  })
  @IsString()
  identifier: string;

  @ApiProperty({
    description: 'Purpose of OTP',
    enum: OtpPurpose,
    example: OtpPurpose.PHONE_VERIFICATION,
  })
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;
}

/**
 * Verify OTP DTO
 */
export class VerifyOtpDto {
  @ApiProperty({
    description: 'Email or phone number',
    example:  '+27821234567',
  })
  @IsString()
  identifier: string;

  @ApiProperty({
    description: '6-digit OTP code',
    example: '123456',
  })
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  code: string;

  @ApiProperty({
    description: 'Purpose of OTP',
    enum:  OtpPurpose,
    example: OtpPurpose.PHONE_VERIFICATION,
  })
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;
}
