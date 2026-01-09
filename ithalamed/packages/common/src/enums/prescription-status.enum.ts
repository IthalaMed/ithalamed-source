/**
 * Status of a prescription
 */
export enum PrescriptionStatus {
  /** Prescription is active and can be dispensed */
  ACTIVE = 'active',
  
  /** Prescription has been partially dispensed */
  PARTIALLY_DISPENSED = 'partially_dispensed',
  
  /** Prescription has been fully dispensed */
  DISPENSED = 'dispensed',
  
  /** Prescription has expired */
  EXPIRED = 'expired',
  
  /** Prescription was cancelled */
  CANCELLED = 'cancelled',
  
  /** Prescription is on hold */
  ON_HOLD = 'on_hold',
}
