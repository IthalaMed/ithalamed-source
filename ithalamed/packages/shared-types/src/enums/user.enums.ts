/**
 * User Type Enum
 * Defines all user roles in the system
 */
export enum UserType {
  PATIENT = 'patient',
  PROVIDER = 'provider',
  NURSE = 'nurse',
  PHARMACIST = 'pharmacist',
  LAB_TECHNICIAN = 'lab_technician',
  EMS = 'ems',
  HOSPITAL_ADMIN = 'hospital_admin',
  INSURANCE_ADMIN = 'insurance_admin',
  GOVERNMENT = 'government',
  ADMIN = 'admin',
  SYSTEM = 'system',
}

/**
 * User Status Enum
 */
export enum UserStatus {
  PENDING_VERIFICATION = 'pending_verification',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  LOCKED = 'locked',
  DELETED = 'deleted',
}

/**
 * MFA Method Enum
 */
export enum MfaMethod {
  TOTP = 'totp',
  SMS = 'sms',
  EMAIL = 'email',
}

/**
 * OTP Purpose Enum
 */
export enum OtpPurpose {
  PHONE_VERIFICATION = 'phone_verification',
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
  LOGIN = 'login',
  TRANSACTION = 'transaction',
}
