/**
 * Purpose of OTP
 */
export enum OtpPurpose {
  /** Phone number verification */
  PHONE_VERIFICATION = 'phone_verification',
  
  /** Email verification */
  EMAIL_VERIFICATION = 'email_verification',
  
  /** Login verification (MFA) */
  LOGIN = 'login',
  
  /** Password reset */
  PASSWORD_RESET = 'password_reset',
  
  /** MFA verification */
  MFA = 'mfa',
  
  /** Transaction verification */
  TRANSACTION = 'transaction',
}
