import { UserType } from '../enums';

/**
 * JWT access token payload
 */
export interface IJwtPayload {
  /** User ID (subject) */
  sub: string;

  /** User email */
  email: string;

  /** User type/role */
  userType: UserType;

  /** User permissions */
  permissions: string[];

  /** Session ID */
  sessionId: string;

  /** Token issued at (Unix timestamp) */
  iat?: number;

  /** Token expiration (Unix timestamp) */
  exp?: number;

  /** Token issuer */
  iss?: string;

  /** Token audience */
  aud?: string;
}

/**
 * JWT refresh token payload
 */
export interface IJwtRefreshPayload {
  /** User ID (subject) */
  sub: string;

  /** Session ID */
  sessionId: string;

  /** Token type */
  type: 'refresh';

  /** Token issued at (Unix timestamp) */
  iat?: number;

  /** Token expiration (Unix timestamp) */
  exp?: number;
}

/**
 * MFA pending token payload
 */
export interface IMfaTokenPayload {
  /** User ID (subject) */
  sub: string;

  /** MFA method required */
  mfaMethod:  string;

  /** Token type */
  type: 'mfa_pending';

  /** Token issued at (Unix timestamp) */
  iat?: number;

  /** Token expiration (Unix timestamp) */
  exp?: number;
}

/**
 * Decoded token with all possible fields
 */
export type DecodedToken = IJwtPayload | IJwtRefreshPayload | IMfaTokenPayload;
