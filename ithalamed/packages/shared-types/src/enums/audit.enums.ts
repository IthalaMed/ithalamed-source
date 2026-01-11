/**
 * Audit Action Enum
 */
export enum AuditAction {
  // Auth actions
  USER_REGISTERED = 'user_registered',
  USER_LOGIN = 'user_login',
  USER_LOGIN_FAILED = 'user_login_failed',
  USER_LOGOUT = 'user_logout',
  USER_LOCKED = 'user_locked',
  USER_UNLOCKED = 'user_unlocked',
  
  // Password actions
  PASSWORD_CHANGED = 'password_changed',
  PASSWORD_RESET_REQUESTED = 'password_reset_requested',
  PASSWORD_RESET_COMPLETED = 'password_reset_completed',
  
  // Token actions
  TOKEN_REFRESHED = 'token_refreshed',
  TOKEN_REVOKED = 'token_revoked',
  
  // OTP actions
  OTP_SENT = 'otp_sent',
  OTP_VERIFIED = 'otp_verified',
  OTP_FAILED = 'otp_failed',
  
  // MFA actions
  MFA_ENABLED = 'mfa_enabled',
  MFA_DISABLED = 'mfa_disabled',
  MFA_VERIFIED = 'mfa_verified',
  MFA_FAILED = 'mfa_failed',
  
  // Data actions
  RECORD_CREATED = 'record_created',
  RECORD_UPDATED = 'record_updated',
  RECORD_DELETED = 'record_deleted',
  RECORD_VIEWED = 'record_viewed',
  RECORD_EXPORTED = 'record_exported',
  
  // Consent actions
  CONSENT_GRANTED = 'consent_granted',
  CONSENT_REVOKED = 'consent_revoked',
}
