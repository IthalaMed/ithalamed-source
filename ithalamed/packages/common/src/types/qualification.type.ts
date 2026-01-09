/**
 * Professional qualification
 */
export interface Qualification {
  /** Qualification name */
  name: string;
  
  /** Abbreviation (e.g., MBChB, MD) */
  abbreviation?:  string;
  
  /** Issuing institution */
  institution: string;
  
  /** Year obtained */
  year: number;
  
  /** Country */
  country: string;
  
  /** Certificate number */
  certificateNumber?:  string;
  
  /** Is verified */
  verified?:  boolean;
  
  /** Verification date */
  verifiedAt?: Date;
}
