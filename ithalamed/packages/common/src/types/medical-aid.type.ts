/**
 * Medical aid/insurance information
 */
export interface MedicalAid {
  /** Medical aid scheme name */
  scheme: string;
  
  /** Scheme code (if applicable) */
  schemeCode?: string;
  
  /** Membership/Policy number */
  membershipNumber:  string;
  
  /** Dependent code (00 for main member) */
  dependentCode?: string;
  
  /** Plan/Option name */
  plan: string;
  
  /** Plan code */
  planCode?: string;
  
  /** Whether membership has been verified */
  verified?: boolean;
  
  /** Verification date */
  verifiedAt?: Date;
  
  /** Effective date of coverage */
  effectiveDate?: Date;
  
  /** Expiry date of coverage */
  expiryDate?: Date;
  
  /** Main member details (if this is a dependent) */
  mainMember?: {
    name: string;
    membershipNumber: string;
  };
}

/**
 * South African medical aid schemes
 */
export enum MedicalAidScheme {
  DISCOVERY = 'Discovery Health',
  MOMENTUM = 'Momentum Health',
  BONITAS = 'Bonitas',
  MEDSHIELD = 'Medshield',
  GEMS = 'GEMS',
  FEDHEALTH = 'Fedhealth',
  MEDIHELP = 'Medihelp',
  BESTMED = 'Bestmed',
  SIZWE = 'Sizwe Medical Fund',
  POLMED = 'Polmed',
  BANKMED = 'Bankmed',
  LIBERTY = 'Liberty Medical Scheme',
  OTHER = 'Other',
}
