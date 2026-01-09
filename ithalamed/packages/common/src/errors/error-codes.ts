/**
 * Centralized error codes for the IthalaMed platform
 */
export const ErrorCodes = {
  // Authentication errors (AUTH_xxx)
  AUTH_INVALID_CREDENTIALS: 'AUTH_001',
  AUTH_TOKEN_EXPIRED: 'AUTH_002',
  AUTH_TOKEN_INVALID: 'AUTH_003',
  AUTH_REFRESH_TOKEN_EXPIRED: 'AUTH_004',
  AUTH_REFRESH_TOKEN_INVALID: 'AUTH_005',
  AUTH_MFA_REQUIRED: 'AUTH_006',
  AUTH_MFA_INVALID: 'AUTH_007',
  AUTH_ACCOUNT_LOCKED: 'AUTH_008',
  AUTH_ACCOUNT_SUSPENDED: 'AUTH_009',
  AUTH_ACCOUNT_NOT_VERIFIED: 'AUTH_010',
  AUTH_SESSION_EXPIRED: 'AUTH_011',
  AUTH_SESSION_INVALID: 'AUTH_012',

  // User errors (USER_xxx)
  USER_NOT_FOUND: 'USER_001',
  USER_ALREADY_EXISTS: 'USER_002',
  USER_EMAIL_TAKEN: 'USER_003',
  USER_PHONE_TAKEN: 'USER_004',
  USER_INVALID_PASSWORD: 'USER_005',
  USER_PASSWORD_MISMATCH: 'USER_006',

  // Patient errors (PAT_xxx)
  PATIENT_NOT_FOUND: 'PAT_001',
  PATIENT_ALREADY_EXISTS:  'PAT_002',
  PATIENT_ID_NUMBER_TAKEN: 'PAT_003',
  PATIENT_INVALID_ID_NUMBER: 'PAT_004',
  PATIENT_CONSENT_REQUIRED: 'PAT_005',
  PATIENT_INACTIVE: 'PAT_006',

  // Provider errors (PROV_xxx)
  PROVIDER_NOT_FOUND: 'PROV_001',
  PROVIDER_NOT_AVAILABLE: 'PROV_002',
  PROVIDER_INVALID_LICENSE: 'PROV_003',
  PROVIDER_SUSPENDED: 'PROV_004',

  // Appointment errors (APT_xxx)
  APPOINTMENT_NOT_FOUND: 'APT_001',
  APPOINTMENT_SLOT_UNAVAILABLE: 'APT_002',
  APPOINTMENT_ALREADY_BOOKED: 'APT_003',
  APPOINTMENT_CANNOT_CANCEL: 'APT_004',
  APPOINTMENT_CANNOT_RESCHEDULE: 'APT_005',
  APPOINTMENT_IN_PAST: 'APT_006',

  // Prescription errors (RX_xxx)
  PRESCRIPTION_NOT_FOUND: 'RX_001',
  PRESCRIPTION_EXPIRED: 'RX_002',
  PRESCRIPTION_ALREADY_DISPENSED: 'RX_003',
  PRESCRIPTION_INVALID_SIGNATURE: 'RX_004',

  // OTP errors (OTP_xxx)
  OTP_INVALID:  'OTP_001',
  OTP_EXPIRED: 'OTP_002',
  OTP_MAX_ATTEMPTS: 'OTP_003',
  OTP_RATE_LIMITED: 'OTP_004',

  // Validation errors (VAL_xxx)
  VALIDATION_ERROR: 'VAL_001',
  VALIDATION_REQUIRED_FIELD: 'VAL_002',
  VALIDATION_INVALID_FORMAT: 'VAL_003',
  VALIDATION_MIN_LENGTH: 'VAL_004',
  VALIDATION_MAX_LENGTH: 'VAL_005',
  VALIDATION_INVALID_ENUM: 'VAL_006',

  // General errors (GEN_xxx)
  INTERNAL_ERROR: 'GEN_001',
  SERVICE_UNAVAILABLE: 'GEN_002',
  RATE_LIMITED: 'GEN_003',
  FORBIDDEN: 'GEN_004',
  NOT_FOUND: 'GEN_005',
  BAD_REQUEST: 'GEN_006',
  CONFLICT: 'GEN_007',

  // File errors (FILE_xxx)
  FILE_NOT_FOUND: 'FILE_001',
  FILE_TOO_LARGE: 'FILE_002',
  FILE_INVALID_TYPE: 'FILE_003',
  FILE_UPLOAD_FAILED: 'FILE_004',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * Get human-readable message for error code
 */
export function getErrorMessage(code: ErrorCode): string {
  const messages:  Record<ErrorCode, string> = {
    [ErrorCodes. AUTH_INVALID_CREDENTIALS]:  'Invalid email or password',
    [ErrorCodes.AUTH_TOKEN_EXPIRED]: 'Access token has expired',
    [ErrorCodes.AUTH_TOKEN_INVALID]:  'Invalid access token',
    [ErrorCodes.AUTH_REFRESH_TOKEN_EXPIRED]: 'Refresh token has expired',
    [ErrorCodes.AUTH_REFRESH_TOKEN_INVALID]: 'Invalid refresh token',
    [ErrorCodes.AUTH_MFA_REQUIRED]: 'Multi-factor authentication required',
    [ErrorCodes.AUTH_MFA_INVALID]: 'Invalid MFA code',
    [ErrorCodes.AUTH_ACCOUNT_LOCKED]: 'Account is locked due to too many failed attempts',
    [ErrorCodes.AUTH_ACCOUNT_SUSPENDED]: 'Account has been suspended',
    [ErrorCodes.AUTH_ACCOUNT_NOT_VERIFIED]: 'Account has not been verified',
    [ErrorCodes.AUTH_SESSION_EXPIRED]: 'Session has expired',
    [ErrorCodes.AUTH_SESSION_INVALID]: 'Invalid session',
    [ErrorCodes.USER_NOT_FOUND]: 'User not found',
    [ErrorCodes.USER_ALREADY_EXISTS]: 'User already exists',
    [ErrorCodes.USER_EMAIL_TAKEN]: 'Email address is already registered',
    [ErrorCodes. USER_PHONE_TAKEN]:  'Phone number is already registered',
    [ErrorCodes.USER_INVALID_PASSWORD]: 'Password does not meet requirements',
    [ErrorCodes.USER_PASSWORD_MISMATCH]: 'Current password is incorrect',
    [ErrorCodes.PATIENT_NOT_FOUND]: 'Patient not found',
    [ErrorCodes.PATIENT_ALREADY_EXISTS]: 'Patient record already exists',
    [ErrorCodes.PATIENT_ID_NUMBER_TAKEN]: 'ID number is already registered',
    [ErrorCodes.PATIENT_INVALID_ID_NUMBER]: 'Invalid ID number format',
    [ErrorCodes. PATIENT_CONSENT_REQUIRED]: 'Patient consent is required',
    [ErrorCodes. PATIENT_INACTIVE]: 'Patient record is inactive',
    [ErrorCodes.PROVIDER_NOT_FOUND]: 'Healthcare provider not found',
    [ErrorCodes.PROVIDER_NOT_AVAILABLE]: 'Provider is not available',
    [ErrorCodes.PROVIDER_INVALID_LICENSE]: 'Invalid professional license',
    [ErrorCodes.PROVIDER_SUSPENDED]: 'Provider account is suspended',
    [ErrorCodes.APPOINTMENT_NOT_FOUND]: 'Appointment not found',
    [ErrorCodes. APPOINTMENT_SLOT_UNAVAILABLE]: 'Selected time slot is not available',
    [ErrorCodes.APPOINTMENT_ALREADY_BOOKED]: 'You already have an appointment at this time',
    [ErrorCodes.APPOINTMENT_CANNOT_CANCEL]: 'Appointment cannot be cancelled',
    [ErrorCodes.APPOINTMENT_CANNOT_RESCHEDULE]: 'Appointment cannot be rescheduled',
    [ErrorCodes.APPOINTMENT_IN_PAST]: 'Cannot book appointments in the past',
    [ErrorCodes.PRESCRIPTION_NOT_FOUND]: 'Prescription not found',
    [ErrorCodes.PRESCRIPTION_EXPIRED]: 'Prescription has expired',
    [ErrorCodes.PRESCRIPTION_ALREADY_DISPENSED]: 'Prescription has already been fully dispensed',
    [ErrorCodes.PRESCRIPTION_INVALID_SIGNATURE]: 'Invalid prescription signature',
    [ErrorCodes.OTP_INVALID]:  'Invalid verification code',
    [ErrorCodes.OTP_EXPIRED]: 'Verification code has expired',
    [ErrorCodes.OTP_MAX_ATTEMPTS]: 'Too many failed attempts. Please request a new code',
    [ErrorCodes.OTP_RATE_LIMITED]: 'Too many requests. Please wait before requesting another code',
    [ErrorCodes.VALIDATION_ERROR]: 'Validation error',
    [ErrorCodes.VALIDATION_REQUIRED_FIELD]: 'Required field is missing',
    [ErrorCodes.VALIDATION_INVALID_FORMAT]: 'Invalid format',
    [ErrorCodes.VALIDATION_MIN_LENGTH]: 'Value is too short',
    [ErrorCodes.VALIDATION_MAX_LENGTH]: 'Value is too long',
    [ErrorCodes. VALIDATION_INVALID_ENUM]:  'Invalid value',
    [ErrorCodes. INTERNAL_ERROR]: 'An unexpected error occurred',
    [ErrorCodes.SERVICE_UNAVAILABLE]: 'Service is temporarily unavailable',
    [ErrorCodes. RATE_LIMITED]: 'Too many requests. Please try again later',
    [ErrorCodes. FORBIDDEN]: 'You do not have permission to perform this action',
    [ErrorCodes.NOT_FOUND]: 'Resource not found',
    [ErrorCodes.BAD_REQUEST]: 'Invalid request',
    [ErrorCodes.CONFLICT]: 'Resource conflict',
    [ErrorCodes. FILE_NOT_FOUND]: 'File not found',
    [ErrorCodes.FILE_TOO_LARGE]: 'File size exceeds the limit',
    [ErrorCodes.FILE_INVALID_TYPE]:  'Invalid file type',
    [ErrorCodes.FILE_UPLOAD_FAILED]: 'File upload failed',
  };

  return messages[code] || 'An error occurred';
}
