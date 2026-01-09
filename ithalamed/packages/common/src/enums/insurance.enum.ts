/**
 * Medical Aid/Insurance Enums
 * 
 * Based on Medical Aid/Insurance Portal requirements from ithalamed_overview2.txt
 */

/**
 * South African Medical Aid Schemes
 */
export enum MedicalAidScheme {
  DISCOVERY = 'discovery',
  BONITAS = 'bonitas',
  MOMENTUM = 'momentum',
  MEDSHIELD = 'medshield',
  GEMS = 'gems',
  FEDHEALTH = 'fedhealth',
  BESTMED = 'bestmed',
  PROFMED = 'profmed',
  KEYHEALTH = 'keyhealth',
  MEDIHELP = 'medihelp',
  SIZWE_HOSMED = 'sizwe_hosmed',
  BANKMED = 'bankmed',
  RESOLUTION = 'resolution',
  LIBERTY = 'liberty',
  SASOLMED = 'sasolmed',
  NETCARE = 'netcare',
  OTHER = 'other',
}

/**
 * Claim status
 */
export enum ClaimStatus {
  /** Claim received */
  RECEIVED = 'received',
  /** Under review */
  PROCESSING = 'processing',
  /** Pending additional info */
  PENDING_INFO = 'pending_info',
  /** Approved */
  APPROVED = 'approved',
  /** Partially approved */
  PARTIALLY_APPROVED = 'partially_approved',
  /** Denied */
  DENIED = 'denied',
  /** Payment processed */
  PAID = 'paid',
  /** Under appeal */
  APPEALED = 'appealed',
  /** Claim closed */
  CLOSED = 'closed',
}

/**
 * Claim type
 */
export enum ClaimType {
  CONSULTATION = 'consultation',
  HOSPITALIZATION = 'hospitalization',
  PROCEDURE = 'procedure',
  MEDICATION = 'medication',
  LABORATORY = 'laboratory',
  RADIOLOGY = 'radiology',
  EMERGENCY = 'emergency',
  MATERNITY = 'maternity',
  DENTAL = 'dental',
  OPTICAL = 'optical',
  CHRONIC_MEDICATION = 'chronic_medication',
  PMB = 'pmb', // Prescribed Minimum Benefits
  OTHER = 'other',
}

/**
 * Pre-authorization status
 */
export enum PreAuthStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DENIED = 'denied',
  EXPIRED = 'expired',
  EXTENDED = 'extended',
  CANCELLED = 'cancelled',
}

/**
 * Fraud detection flags
 */
export enum FraudFlag {
  NONE = 'none',
  DUPLICATE_CLAIM = 'duplicate_claim',
  UNBUNDLING = 'unbundling',
  UPCODING = 'upcoding',
  EXCESSIVE_BILLING = 'excessive_billing',
  PHANTOM_BILLING = 'phantom_billing',
  IDENTITY_FRAUD = 'identity_fraud',
  UNDER_INVESTIGATION = 'under_investigation',
}

/**
 * Member type
 */
export enum MemberType {
  MAIN_MEMBER = 'main_member',
  SPOUSE = 'spouse',
  ADULT_DEPENDENT = 'adult_dependent',
  CHILD_DEPENDENT = 'child_dependent',
}

/**
 * Benefit type
 */
export enum BenefitType {
  IN_HOSPITAL = 'in_hospital',
  OUT_OF_HOSPITAL = 'out_of_hospital',
  SAVINGS = 'savings',
  DAY_TO_DAY = 'day_to_day',
  CHRONIC = 'chronic',
  MATERNITY = 'maternity',
  DENTAL = 'dental',
  OPTICAL = 'optical',
  PMB = 'pmb',
}
