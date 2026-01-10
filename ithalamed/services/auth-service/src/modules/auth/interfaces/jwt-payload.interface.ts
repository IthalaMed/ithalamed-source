import { UserType } from '@ithalamed/common';

/**
 * JWT Access Token Payload
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string | null;
  phoneNumber: string;
  userType: UserType;
  sessionId: string;
  iat?:  number;
  exp?: number;
}

/**
 * JWT Refresh Token Payload
 */
export interface JwtRefreshPayload {
  sub: string; // User ID
  tokenId: string; // Refresh token ID
  familyId: string; // Token family for rotation
  iat?: number;
  exp?:  number;
}

/**
 * MFA Token Payload (temporary token for MFA verification)
 */
export interface MfaTokenPayload {
  sub: string; // User ID
  purpose: 'mfa_verification';
  iat?: number;
  exp?:  number;
}
