/**
 * Multi-factor authentication methods
 */
export enum MfaMethod {
  /** No MFA enabled */
  NONE = 'none',
  
  /** Time-based One-Time Password (Authenticator app) */
  TOTP = 'totp',
  
  /** SMS OTP */
  SMS = 'sms',
  
  /** Email OTP */
  EMAIL = 'email',
}
