import { IsString, IsEnum, IsOptional, Length, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MfaMethod } from '@ithalamed/common';

/**
 * Enable MFA DTO
 */
export class EnableMfaDto {
  @ApiProperty({
    description: 'MFA method to enable',
    enum: MfaMethod,
    example: MfaMethod. TOTP,
  })
  @IsEnum(MfaMethod, { message: 'Invalid MFA method' })
  method: MfaMethod;

  @ApiProperty({
    description: 'Current password (required for security)',
  })
  @IsString()
  password: string;
}

/**
 * Verify MFA Setup DTO (confirm TOTP setup)
 */
export class VerifyMfaSetupDto {
  @ApiProperty({
    description: 'TOTP code from authenticator app',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @Length(6, 6, { message: 'Code must be exactly 6 digits' })
  code: string;
}

/**
 * Verify MFA DTO (during login)
 */
export class VerifyMfaDto {
  @ApiProperty({
    description: 'MFA session token (received from initial login)',
  })
  @IsString()
  mfaToken: string;

  @ApiProperty({
    description:  'TOTP code or backup code',
    example: '123456',
  })
  @IsString()
  code: string;

  @ApiPropertyOptional({
    description: 'Set to true if using a backup code',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isBackupCode?: boolean;
}

/**
 * Disable MFA DTO
 */
export class DisableMfaDto {
  @ApiProperty({
    description: 'Current password',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Current TOTP code (for verification)',
    example: '123456',
  })
  @IsString()
  @Length(6, 6, { message: 'Code must be exactly 6 digits' })
  code: string;
}
