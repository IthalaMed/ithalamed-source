/**
 * Laboratory Enums
 * 
 * Based on Laboratory Information System requirements from ithalamed_overview2.txt
 */

/**
 * Lab test categories
 */
export enum LabTestCategory {
  HEMATOLOGY = 'hematology',
  CHEMISTRY = 'chemistry',
  MICROBIOLOGY = 'microbiology',
  IMMUNOLOGY = 'immunology',
  URINALYSIS = 'urinalysis',
  COAGULATION = 'coagulation',
  ENDOCRINOLOGY = 'endocrinology',
  TOXICOLOGY = 'toxicology',
  SEROLOGY = 'serology',
  MOLECULAR = 'molecular',
  CYTOLOGY = 'cytology',
  HISTOPATHOLOGY = 'histopathology',
  BLOOD_BANK = 'blood_bank',
  POINT_OF_CARE = 'point_of_care',
  OTHER = 'other',
}

/**
 * Lab order status
 */
export enum LabOrderStatus {
  /** Order placed */
  ORDERED = 'ordered',
  /** Sample collection scheduled */
  SCHEDULED = 'scheduled',
  /** Sample collected */
  COLLECTED = 'collected',
  /** Sample received at lab */
  RECEIVED = 'received',
  /** Sample rejected (quality issue) */
  REJECTED = 'rejected',
  /** Testing in progress */
  IN_PROGRESS = 'in_progress',
  /** Results pending review */
  PENDING_REVIEW = 'pending_review',
  /** Results finalized */
  COMPLETED = 'completed',
  /** Order cancelled */
  CANCELLED = 'cancelled',
}

/**
 * Lab order priority
 */
export enum LabOrderPriority {
  /** Normal turnaround time */
  ROUTINE = 'routine',
  /** Faster turnaround */
  URGENT = 'urgent',
  /** Immediate processing */
  STAT = 'stat',
  /** Time-sensitive (e.g., timed specimens) */
  TIMED = 'timed',
}

/**
 * Specimen type
 */
export enum SpecimenType {
  BLOOD_SERUM = 'blood_serum',
  BLOOD_PLASMA = 'blood_plasma',
  BLOOD_WHOLE = 'blood_whole',
  BLOOD_EDTA = 'blood_edta',
  BLOOD_CITRATE = 'blood_citrate',
  URINE_RANDOM = 'urine_random',
  URINE_24_HOUR = 'urine_24_hour',
  URINE_MIDSTREAM = 'urine_midstream',
  STOOL = 'stool',
  SPUTUM = 'sputum',
  SWAB_THROAT = 'swab_throat',
  SWAB_NASAL = 'swab_nasal',
  SWAB_WOUND = 'swab_wound',
  SWAB_VAGINAL = 'swab_vaginal',
  SWAB_URETHRAL = 'swab_urethral',
  CSF = 'csf',
  SYNOVIAL_FLUID = 'synovial_fluid',
  PLEURAL_FLUID = 'pleural_fluid',
  ASCITIC_FLUID = 'ascitic_fluid',
  TISSUE_BIOPSY = 'tissue_biopsy',
  BONE_MARROW = 'bone_marrow',
  HAIR = 'hair',
  NAILS = 'nails',
  OTHER = 'other',
}

/**
 * Result flag for abnormal values
 */
export enum ResultFlag {
  NORMAL = 'normal',
  LOW = 'low',
  HIGH = 'high',
  CRITICAL_LOW = 'critical_low',
  CRITICAL_HIGH = 'critical_high',
  ABNORMAL = 'abnormal',
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  INDETERMINATE = 'indeterminate',
}
