/**
 * Status of a healthcare provider
 */
export enum ProviderStatus {
  /** Provider is active and accepting patients */
  ACTIVE = 'active',
  
  /** Provider is temporarily inactive */
  INACTIVE = 'inactive',
  
  /** Provider is pending verification */
  PENDING_VERIFICATION = 'pending_verification',
  
  /** Provider is suspended */
  SUSPENDED = 'suspended',
  
  /** Provider has retired */
  RETIRED = 'retired',

  ON_LEAVE = 'on_leave',
}
