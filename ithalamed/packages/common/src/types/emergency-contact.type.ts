/**
 * Emergency contact information
 */
export interface EmergencyContact {
  /** Contact's full name */
  name: string;
  
  /** Relationship to patient */
  relationship:  string;
  
  /** Primary phone number */
  phoneNumber: string;
  
  /** Alternative phone number */
  alternativePhone?: string;
  
  /** Email address */
  email?:  string;
  
  /** Priority order (1 = primary contact) */
  priority:  number;
  
  /** Whether this contact can make medical decisions */
  canMakeMedicalDecisions?:  boolean;
}

/**
 * Common relationship types
 */
export enum RelationshipType {
  SPOUSE = 'Spouse',
  PARENT = 'Parent',
  CHILD = 'Child',
  SIBLING = 'Sibling',
  GRANDPARENT = 'Grandparent',
  GRANDCHILD = 'Grandchild',
  AUNT_UNCLE = 'Aunt/Uncle',
  COUSIN = 'Cousin',
  FRIEND = 'Friend',
  COLLEAGUE = 'Colleague',
  CAREGIVER = 'Caregiver',
  LEGAL_GUARDIAN = 'Legal Guardian',
  OTHER = 'Other',
}
