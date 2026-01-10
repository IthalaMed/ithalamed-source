import { UserType, UserStatus } from '../enums';

/**
 * JWT Token Payload
 */
export interface JwtPayload {
  sub:  string;
  email: string | null;
  phoneNumber: string;
  userType: UserType;
  sessionId?: string;
  iat?: number;
  exp?: number;
}

/**
 * JWT Refresh Token Payload
 */
export interface JwtRefreshPayload {
  sub: string;
  tokenId: string;
  familyId: string;
  iat?: number;
  exp?:  number;
}

/**
 * Authenticated User (from JWT)
 */
export interface AuthenticatedUser {
  id: string;
  email:  string | null;
  phoneNumber: string;
  userType:  UserType;
  sessionId?:  string;
}

/**
 * Auth Tokens
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

/**
 * Device Info
 */
export interface DeviceInfo {
  deviceId?:  string;
  deviceType?: string;
  deviceName?: string;
  platform?: string;
  appVersion?: string;
  osVersion?: string;
}
