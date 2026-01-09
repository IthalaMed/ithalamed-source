/**
 * Audit action types for comprehensive logging
 */
export enum AuditAction {
  // Authentication actions
  USER_REGISTERED = 'user_registered',
  USER_LOGIN = 'user_login',
  USER_LOGIN_FAILED = 'user_login_failed',
  USER_LOGOUT = 'user_logout',
  USER_LOCKED = 'user_locked',
  USER_UNLOCKED = 'user_unlocked',
  PASSWORD_CHANGED = 'password_changed',
  PASSWORD_RESET_REQUESTED = 'password_reset_requested',
  PASSWORD_RESET_COMPLETED = 'password_reset_completed',
  MFA_ENABLED = 'mfa_enabled',
  MFA_DISABLED = 'mfa_disabled',
  MFA_VERIFIED = 'mfa_verified',
  MFA_FAILED = 'mfa_failed',
  OTP_SENT = 'otp_sent',
  OTP_VERIFIED = 'otp_verified',
  OTP_FAILED = 'otp_failed',
  TOKEN_REFRESHED = 'token_refreshed',
  SESSION_CREATED = 'session_created',
  SESSION_TERMINATED = 'session_terminated',
  
  // Patient actions
  PATIENT_CREATED = 'patient_created',
  PATIENT_UPDATED = 'patient_updated',
  PATIENT_VIEWED = 'patient_viewed',
  PATIENT_DELETED = 'patient_deleted',
  PATIENT_MERGED = 'patient_merged',
  
  // Medical record actions
  MEDICAL_RECORD_VIEWED = 'medical_record_viewed',
  MEDICAL_RECORD_CREATED = 'medical_record_created',
  MEDICAL_RECORD_UPDATED = 'medical_record_updated',
  MEDICAL_RECORD_EXPORTED = 'medical_record_exported',
  
  // Consent actions
  CONSENT_GRANTED = 'consent_granted',
  CONSENT_REVOKED = 'consent_revoked',
  CONSENT_UPDATED = 'consent_updated',
  
  // Document actions
  DOCUMENT_UPLOADED = 'document_uploaded',
  DOCUMENT_VIEWED = 'document_viewed',
  DOCUMENT_DOWNLOADED = 'document_downloaded',
  DOCUMENT_DELETED = 'document_deleted',
  
  // Emergency contact actions
  EMERGENCY_CONTACT_ADDED = 'emergency_contact_added',
  EMERGENCY_CONTACT_UPDATED = 'emergency_contact_updated',
  EMERGENCY_CONTACT_REMOVED = 'emergency_contact_removed',
  
  // Dependent/Guardian actions
  DEPENDENT_ADDED = 'dependent_added',
  DEPENDENT_REMOVED = 'dependent_removed',
  GUARDIAN_ASSIGNED = 'guardian_assigned',
  GUARDIAN_REMOVED = 'guardian_removed',
  
  // Medical aid actions
  MEDICAL_AID_ADDED = 'medical_aid_added',
  MEDICAL_AID_UPDATED = 'medical_aid_updated',
  MEDICAL_AID_VERIFIED = 'medical_aid_verified',
  MEDICAL_AID_REMOVED = 'medical_aid_removed',
  
  // Data export/deletion (POPIA)
  DATA_EXPORT_REQUESTED = 'data_export_requested',
  DATA_EXPORT_COMPLETED = 'data_export_completed',
  DATA_DELETION_REQUESTED = 'data_deletion_requested',
  DATA_DELETION_COMPLETED = 'data_deletion_completed',
  
  // System actions
  SYSTEM_ERROR = 'system_error',
  SECURITY_ALERT = 'security_alert',
}
