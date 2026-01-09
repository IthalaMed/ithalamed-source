/**
 * Prescription Enums
 * 
 * Based on Prescription Service requirements from ithalamed_overview. txt
 * and Pharmacy Management from ithalamed_overview2.txt
 */

/**
 * Prescription status
 */
export enum PrescriptionStatus {
  /** Prescription created, not yet sent */
  DRAFT = 'draft',
  /** Prescription active and valid */
  ACTIVE = 'active',
  /** Partially dispensed (refills remaining) */
  PARTIALLY_DISPENSED = 'partially_dispensed',
  /** Fully dispensed (no refills remaining) */
  DISPENSED = 'dispensed',
  /** Prescription expired */
  EXPIRED = 'expired',
  /** Prescription cancelled by provider */
  CANCELLED = 'cancelled',
  /** On hold pending clarification */
  ON_HOLD = 'on_hold',
}

/**
 * Medication route of administration
 */
export enum MedicationRoute {
  ORAL = 'oral',
  SUBLINGUAL = 'sublingual',
  BUCCAL = 'buccal',
  INTRAVENOUS = 'intravenous',
  INTRAMUSCULAR = 'intramuscular',
  SUBCUTANEOUS = 'subcutaneous',
  INTRADERMAL = 'intradermal',
  TOPICAL = 'topical',
  TRANSDERMAL = 'transdermal',
  INHALATION = 'inhalation',
  NASAL = 'nasal',
  OPHTHALMIC = 'ophthalmic',
  OTIC = 'otic',
  RECTAL = 'rectal',
  VAGINAL = 'vaginal',
  INTRATHECAL = 'intrathecal',
  EPIDURAL = 'epidural',
  OTHER = 'other',
}

/**
 * Medication form/formulation
 */
export enum MedicationForm {
  TABLET = 'tablet',
  CAPSULE = 'capsule',
  SYRUP = 'syrup',
  SUSPENSION = 'suspension',
  SOLUTION = 'solution',
  INJECTION = 'injection',
  CREAM = 'cream',
  OINTMENT = 'ointment',
  GEL = 'gel',
  LOTION = 'lotion',
  DROPS = 'drops',
  SPRAY = 'spray',
  INHALER = 'inhaler',
  NEBULIZER = 'nebulizer',
  PATCH = 'patch',
  SUPPOSITORY = 'suppository',
  POWDER = 'powder',
  GRANULES = 'granules',
  EFFERVESCENT = 'effervescent',
  LOZENGE = 'lozenge',
  PESSARY = 'pessary',
  ENEMA = 'enema',
  OTHER = 'other',
}

/**
 * Medication frequency
 */
export enum MedicationFrequency {
  /** Once daily */
  ONCE_DAILY = 'once_daily',
  /** Twice daily */
  TWICE_DAILY = 'twice_daily',
  /** Three times daily */
  THREE_TIMES_DAILY = 'three_times_daily',
  /** Four times daily */
  FOUR_TIMES_DAILY = 'four_times_daily',
  /** Every 4 hours */
  EVERY_4_HOURS = 'every_4_hours',
  /** Every 6 hours */
  EVERY_6_HOURS = 'every_6_hours',
  /** Every 8 hours */
  EVERY_8_HOURS = 'every_8_hours',
  /** Every 12 hours */
  EVERY_12_HOURS = 'every_12_hours',
  /** Once weekly */
  ONCE_WEEKLY = 'once_weekly',
  /** Twice weekly */
  TWICE_WEEKLY = 'twice_weekly',
  /** Once monthly */
  ONCE_MONTHLY = 'once_monthly',
  /** As needed (PRN) */
  AS_NEEDED = 'as_needed',
  /** At bedtime */
  AT_BEDTIME = 'at_bedtime',
  /** Before meals */
  BEFORE_MEALS = 'before_meals',
  /** After meals */
  AFTER_MEALS = 'after_meals',
  /** With meals */
  WITH_MEALS = 'with_meals',
  /** Single dose */
  SINGLE_DOSE = 'single_dose',
  /** Continuous */
  CONTINUOUS = 'continuous',
  /** Other/Custom */
  OTHER = 'other',
}

/**
 * Controlled substance schedule (South African)
 */
export enum ControlledSubstanceSchedule {
  /** Not controlled */
  NONE = 'none',
  /** Schedule 1 - Available without prescription */
  SCHEDULE_1 = 'schedule_1',
  /** Schedule 2 - Pharmacy only */
  SCHEDULE_2 = 'schedule_2',
  /** Schedule 3 - Prescription required */
  SCHEDULE_3 = 'schedule_3',
  /** Schedule 4 - Prescription required, specific conditions */
  SCHEDULE_4 = 'schedule_4',
  /** Schedule 5 - Controlled, prescription required */
  SCHEDULE_5 = 'schedule_5',
  /** Schedule 6 - Controlled, special permit required */
  SCHEDULE_6 = 'schedule_6',
  /** Schedule 7 - Prohibited */
  SCHEDULE_7 = 'schedule_7',
  /** Schedule 8 - Controlled (cannabis) */
  SCHEDULE_8 = 'schedule_8',
}

/**
 * Dispensing status
 */
export enum DispensingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  DISPENSED = 'dispensed',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
}
