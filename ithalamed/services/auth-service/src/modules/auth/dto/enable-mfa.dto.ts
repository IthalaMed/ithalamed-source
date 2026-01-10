import { IsString, IsEnum, IsOptional, Length } from 'class-validator';
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
  @IsEnum(MfaMethod)
  method: MfaMethod;

  @ApiProperty({
    description: 'Current password (required for enabling MFA)',
  })
  @IsString()
  password: string;
}

/**
 * Verify MFA Setup DTO
 */
export class VerifyMfaSetupDto {
  @ApiProperty({
    description: 'TOTP code from authenticator app',
    example: '123456',
  })
  @IsString()
  @Length(6, 6)
  code: string;
}

/**
 * Verify MFA DTO (during login)
 */
export class VerifyMfaDto {
  @ApiProperty({
    description: 'MFA session token (from initial login)',
  })
  @IsString()
  mfaToken: string;

  @ApiProperty({
    description: 'TOTP code or backup code',
    example: '123456',
  })
  @IsString()
  code: string;

  @ApiPropertyOptional({
    description: 'Whether using backup code instead of TOTP',
    default: false,
  })
  @IsOptional()
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
  @Length(6, 6)
  code: string;
}
