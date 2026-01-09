/**
 * Status of a patient record
 */
export enum PatientStatus {
  /** Patient is active and receiving care */
  ACTIVE = 'active',
  
  /** Patient record is inactive (moved away, etc.) */
  INACTIVE = 'inactive',
  
  /** Patient is deceased */
  DECEASED = 'deceased',
}
