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

