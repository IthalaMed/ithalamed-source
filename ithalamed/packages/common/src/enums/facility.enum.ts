/**
 * Healthcare Facility Enums
 */

/**
 * Facility types
 */
export enum FacilityType {
  /** Full-service hospital */
  HOSPITAL = 'hospital',
  /** Private clinic */
  CLINIC = 'clinic',
  /** Community health center */
  COMMUNITY_HEALTH_CENTER = 'community_health_center',
  /** Medical practice/GP office */
  MEDICAL_PRACTICE = 'medical_practice',
  /** Specialist center */
  SPECIALIST_CENTER = 'specialist_center',
  /** Pharmacy */
  PHARMACY = 'pharmacy',
  /** Laboratory */
  LABORATORY = 'laboratory',
  /** Imaging/Radiology center */
  IMAGING_CENTER = 'imaging_center',
  /** Day surgery center */
  DAY_SURGERY = 'day_surgery',
  /** Rehabilitation center */
  REHABILITATION = 'rehabilitation',
  /** Dialysis center */
  DIALYSIS_CENTER = 'dialysis_center',
  /** Mental health facility */
  MENTAL_HEALTH = 'mental_health',
  /** Nursing home/Long-term care */
  NURSING_HOME = 'nursing_home',
  /** Maternity home */
  MATERNITY_HOME = 'maternity_home',
  /** Dental practice */
  DENTAL_PRACTICE = 'dental_practice',
  /** Optometry practice */
  OPTOMETRY = 'optometry',
  /** Home care agency */
  HOME_CARE = 'home_care',
  /** Ambulance service */
  AMBULANCE_SERVICE = 'ambulance_service',
  /** Other */
  OTHER = 'other',
}

/**
 * Facility status
 */
export enum FacilityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_APPROVAL = 'pending_approval',
  SUSPENDED = 'suspended',
  CLOSED = 'closed',
}

/**
 * Hospital department types
 */
export enum HospitalDepartment {
  EMERGENCY = 'emergency',
  OUTPATIENT = 'outpatient',
  INPATIENT = 'inpatient',
  ICU = 'icu',
  CCU = 'ccu',
  NICU = 'nicu',
  PICU = 'picu',
  MATERNITY = 'maternity',
  LABOR_DELIVERY = 'labor_delivery',
  SURGERY = 'surgery',
  RECOVERY = 'recovery',
  RADIOLOGY = 'radiology',
  LABORATORY = 'laboratory',
  PHARMACY = 'pharmacy',
  PHYSIOTHERAPY = 'physiotherapy',
  OCCUPATIONAL_THERAPY = 'occupational_therapy',
  DIALYSIS = 'dialysis',
  ONCOLOGY = 'oncology',
  CARDIOLOGY = 'cardiology',
  NEUROLOGY = 'neurology',
  ORTHOPEDICS = 'orthopedics',
  PEDIATRICS = 'pediatrics',
  PSYCHIATRY = 'psychiatry',
  ADMINISTRATION = 'administration',
}

/**
 * Bed status for bed management
 */
export enum BedStatus {
  /** Clean and ready for patient */
  AVAILABLE = 'available',
  /** Currently occupied */
  OCCUPIED = 'occupied',
  /** Needs cleaning */
  DIRTY = 'dirty',
  /** Under maintenance */
  MAINTENANCE = 'maintenance',
  /** Reserved for incoming patient */
  RESERVED = 'reserved',
  /** Blocked/Not in use */
  BLOCKED = 'blocked',
}

/**
 * Bed type
 */
export enum BedType {
  STANDARD = 'standard',
  ICU = 'icu',
  CCU = 'ccu',
  NICU = 'nicu',
  ISOLATION = 'isolation',
  BARIATRIC = 'bariatric',
  PEDIATRIC = 'pediatric',
  MATERNITY = 'maternity',
  PSYCHIATRIC = 'psychiatric',
  OBSERVATION = 'observation',
}
