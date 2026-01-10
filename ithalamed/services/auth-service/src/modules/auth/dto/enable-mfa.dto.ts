import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserType, UserStatus } from '@ithalamed/common';

/**
 * User response DTO (sanitized, no sensitive data)
 */
export class UserResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'thandi@example.com', nullable: true })
  email: string | null;

  @ApiProperty({ example: '+27821234567' })
  phoneNumber: string;

  @ApiProperty({ enum: UserType, example: UserType.PATIENT })
  userType: UserType;

  @ApiProperty({ enum: UserStatus, example: UserStatus.ACTIVE })
  status: UserStatus;

  @ApiProperty({ example: 'Thandi' })
  firstName: string;

  @ApiProperty({ example: 'Mbatha' })
  lastName: string;

  @ApiPropertyOptional({ example: 'Thandi Mbatha' })
  displayName?:  string;

  @ApiPropertyOptional({ example: 'https://storage.ithalamed.com/avatars/abc. jpg' })
  profilePhotoUrl?: string;

  @ApiProperty({ example: true })
  emailVerified: boolean;

  @ApiProperty({ example: true })
  phoneVerified: boolean;

  @ApiProperty({ example: false })
  mfaEnabled: boolean;

  @ApiProperty({ example: 'en' })
  preferredLanguage: string;

  @ApiProperty({ example: '2024-01-10T12:00:00.000Z' })
  createdAt: Date;
}

/**
 * Auth tokens response DTO
 */
export class TokensResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token',
    example:  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Access token expiry time in seconds',
    example: 900,
  })
  expiresIn: number;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
    default: 'Bearer',
  })
  tokenType: string;
}

/**
 * Successful login response DTO
 */
export class LoginResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ type: TokensResponseDto })
  tokens: TokensResponseDto;

  @ApiPropertyOptional({
    description: 'Session ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  sessionId?: string;
}

/**
 * MFA required response DTO (returned when user has MFA enabled)
 */
export class MfaRequiredResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: true })
  mfaRequired: boolean;

  @ApiProperty({
    description: 'Temporary MFA session token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  mfaToken: string;

  @ApiProperty({
    description:  'MFA method configured for user',
    example: 'totp',
  })
  mfaMethod: string;

  @ApiProperty({
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;
}

/**
 * MFA setup response DTO
 */
export class MfaSetupResponseDto {
  @ApiProperty({
    description: 'TOTP secret key (base32 encoded)',
    example: 'JBSWY3DPEHPK3PXP',
  })
  secret: string;

  @ApiProperty({
    description: 'QR code as data URL (for authenticator apps)',
    example: 'data:image/png;base64,... ',
  })
  qrCode: string;

  @ApiProperty({
    description: 'Backup codes (store securely)',
    example: ['ABCD1234', 'EFGH5678'],
    type: [String],
  })
  backupCodes: string[];
}

/**
 * Registration response DTO
 */
export class RegisterResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({
    description: 'Success message with next steps',
    example: 'Registration successful.  Please verify your phone number.',
  })
  message: string;

  @ApiProperty({
    description: 'Whether phone verification is required',
    example:  true,
  })
  requiresPhoneVerification: boolean;

  @ApiProperty({
    description:  'Whether email verification is required',
    example:  false,
  })
  requiresEmailVerification: boolean;
}

/**
 * Generic message response DTO
 */
export class MessageResponseDto {
  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;
}
