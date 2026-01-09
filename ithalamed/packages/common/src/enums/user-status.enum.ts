/**
 * Status of a user account
 */
export enum UserStatus {
  /** Account created but email/phone not verified */
  PENDING_VERIFICATION = 'pending_verification',
  
  /** Account is active and usable */
  ACTIVE = 'active',
  
  /** Account is temporarily inactive */
  INACTIVE = 'inactive',
  
  /** Account is locked due to failed login attempts */
  LOCKED = 'locked',
  
  /** Account is suspended by admin */
  SUSPENDED = 'suspended',
  
  /** Account is permanently deactivated */
  DEACTIVATED = 'deactivated',
}

/**
 * Check if user status allows login
 */
export function canUserLogin(status: UserStatus): boolean {
  return status === UserStatus.ACTIVE;
}

/**
 * Check if user status allows account recovery
 */
export function canRecoverAccount(status: UserStatus): boolean {
  return [
    UserStatus. PENDING_VERIFICATION,
    UserStatus. INACTIVE,
    UserStatus.LOCKED,
  ].includes(status);
}
