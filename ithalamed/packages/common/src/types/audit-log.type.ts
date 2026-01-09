/**
 * Audit log entry type
 */
export interface AuditLogEntry {
  /** Unique log ID */
  id:  string;
  
  /** User who performed the action */
  userId?:  string;
  
  /** Action performed */
  action:  string;
  
  /** Resource type (e.g., 'Patient', 'Appointment') */
  resource: string;
  
  /** Resource ID */
  resourceId?: string;
  
  /** IP address of the request */
  ipAddress?: string;
  
  /** User agent string */
  userAgent?: string;
  
  /** Whether the action was successful */
  success: boolean;
  
  /** Error message if action failed */
  errorMessage?: string;
  
  /** Additional metadata */
  metadata?:  Record<string, unknown>;
  
  /** Changes made (before/after) */
  changes?: {
    before?:  Record<string, unknown>;
    after?: Record<string, unknown>;
  };
  
  /** Timestamp */
  createdAt: Date;
}

/**
 * Common audit actions
 */
export enum AuditAction {
  // Auth actions
  USER_REGISTERED = 'USER_REGISTERED',
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_LOGIN_FAILED = 'USER_LOGIN_FAILED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  MFA_ENABLED = 'MFA_ENABLED',
  MFA_DISABLED = 'MFA_DISABLED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_UNLOCKED = 'ACCOUNT_UNLOCKED',
  
  // Patient actions
  PATIENT_CREATED = 'PATIENT_CREATED',
  PATIENT_UPDATED = 'PATIENT_UPDATED',
  PATIENT_VIEWED = 'PATIENT_VIEWED',
  PATIENT_DEACTIVATED = 'PATIENT_DEACTIVATED',
  MEDICAL_RECORD_VIEWED = 'MEDICAL_RECORD_VIEWED',
  MEDICAL_RECORD_UPDATED = 'MEDICAL_RECORD_UPDATED',
  
  // Appointment actions
  APPOINTMENT_CREATED = 'APPOINTMENT_CREATED',
  APPOINTMENT_UPDATED = 'APPOINTMENT_UPDATED',
  APPOINTMENT_CANCELLED = 'APPOINTMENT_CANCELLED',
  APPOINTMENT_COMPLETED = 'APPOINTMENT_COMPLETED',
  
  // Prescription actions
  PRESCRIPTION_CREATED = 'PRESCRIPTION_CREATED',
  PRESCRIPTION_DISPENSED = 'PRESCRIPTION_DISPENSED',
  PRESCRIPTION_CANCELLED = 'PRESCRIPTION_CANCELLED',
  
  // Data access
  PHI_ACCESSED = 'PHI_ACCESSED',
  DATA_EXPORTED = 'DATA_EXPORTED',
  CONSENT_UPDATED = 'CONSENT_UPDATED',
}
