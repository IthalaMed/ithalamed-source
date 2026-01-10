import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserType, UserStatus } from '@ithalamed/common';

/**
 * User response (without sensitive data)
 */
export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string | null;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ enum: UserType })
  userType: UserType;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional()
  displayName?: string;

  @ApiPropertyOptional()
  profilePhotoUrl?: string;

  @ApiProperty()
  emailVerified: boolean;

  @ApiProperty()
  phoneVerified: boolean;

  @ApiProperty()
  mfaEnabled: boolean;

  @ApiProperty()
  preferredLanguage: string;

  @ApiProperty()
  createdAt: Date;
}

/**
 * Auth tokens response
 */
export class TokensResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'JWT refresh token' })
  refreshToken: string;

  @ApiProperty({ description: 'Access token expiry time (seconds)' })
  expiresIn: number;

  @ApiProperty({ description: 'Token type', default: 'Bearer' })
  tokenType: string;
}

/**
 * Login response
 */
export class LoginResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ type: TokensResponseDto })
  tokens: TokensResponseDto;

  @ApiPropertyOptional({ description: 'Session ID' })
  sessionId?: string;
}

/**
 * MFA required response (returned when user has MFA enabled)
 */
export class MfaRequiredResponseDto {
  @ApiProperty({ default: false })
  success: boolean;

  @ApiProperty({ default: true })
  mfaRequired: boolean;

  @ApiProperty({ description: 'Temporary MFA token for verification' })
  mfaToken: string;

  @ApiProperty({ description: 'MFA method configured' })
  mfaMethod: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;
}

/**
 * MFA setup response
 */
export class MfaSetupResponseDto {
  @ApiProperty({ description: 'Secret key (base32 encoded)' })
  secret: string;

  @ApiProperty({ description: 'QR code data URL' })
  qrCode: string;

  @ApiProperty({ description: 'Backup codes (store these safely)' })
  backupCodes: string[];
}

/**
 * Register response
 */
export class RegisterResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ description: 'Message about next steps' })
  message: string;

  @ApiProperty({ description: 'Whether phone verification is required' })
  requiresPhoneVerification: boolean;

  @ApiProperty({ description: 'Whether email verification is required' })
  requiresEmailVerification: boolean;
}
