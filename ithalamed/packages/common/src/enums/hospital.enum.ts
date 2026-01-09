/**
 * Hospital Operations Enums
 * 
 * Based on Hospital Operations System requirements from ithalamed_overview2.txt
 */

/**
 * Shift types for staff scheduling
 */
export enum ShiftType {
  /** Day shift:  7: 00 AM - 3:00 PM */
  DAY = 'day',
  /** Evening shift: 3:00 PM - 11:00 PM */
  EVENING = 'evening',
  /** Night shift: 11:00 PM - 7:00 AM */
  NIGHT = 'night',
  /** 12-hour day:  7:00 AM - 7:00 PM */
  TWELVE_HOUR_DAY = 'twelve_hour_day',
  /** 12-hour night: 7:00 PM - 7:00 AM */
  TWELVE_HOUR_NIGHT = 'twelve_hour_night',
  /** On-call */
  ON_CALL = 'on_call',
  /** Custom shift */
  CUSTOM = 'custom',
}

/**
 * Staff shift status
 */
export enum ShiftStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  SWAP_REQUESTED = 'swap_requested',
  SWAP_APPROVED = 'swap_approved',
}

/**
 * Hospital rounds types
 */
export enum RoundsType {
  /** Daily morning rounds */
  MORNING = 'morning',
  /** Evening rounds */
  EVENING = 'evening',
  /** Multidisciplinary team rounds */
  MULTIDISCIPLINARY = 'multidisciplinary',
  /** Teaching/Academic rounds */
  TEACHING = 'teaching',
  /** Executive/Admin rounds */
  EXECUTIVE = 'executive',
  /** Specialty rounds */
  SPECIALTY = 'specialty',
  /** Nursing rounds */
  NURSING = 'nursing',
}

/**
 * Patient ward/unit types
 */
export enum WardType {
  MEDICAL = 'medical',
  SURGICAL = 'surgical',
  PEDIATRIC = 'pediatric',
  MATERNITY = 'maternity',
  ICU = 'icu',
  CCU = 'ccu',
  NICU = 'nicu',
  STEP_DOWN = 'step_down',
  PSYCHIATRIC = 'psychiatric',
  ISOLATION = 'isolation',
  ONCOLOGY = 'oncology',
  ORTHOPEDIC = 'orthopedic',
  NEUROLOGY = 'neurology',
  CARDIOLOGY = 'cardiology',
  REHABILITATION = 'rehabilitation',
}

/**
 * Admission type
 */
export enum AdmissionType {
  ELECTIVE = 'elective',
  EMERGENCY = 'emergency',
  URGENT = 'urgent',
  TRANSFER = 'transfer',
  OBSERVATION = 'observation',
  DAY_CASE = 'day_case',
}

/**
 * Discharge type
 */
export enum DischargeType {
  HOME = 'home',
  TRANSFER_FACILITY = 'transfer_facility',
  TRANSFER_ICU = 'transfer_icu',
  AGAINST_MEDICAL_ADVICE = 'against_medical_advice',
  DEATH = 'death',
  ABSCONDED = 'absconded',
}

/**
 * Inpatient status
 */
export enum InpatientStatus {
  ADMITTED = 'admitted',
  IN_TREATMENT = 'in_treatment',
  STABLE = 'stable',
  CRITICAL = 'critical',
  IMPROVING = 'improving',
  DETERIORATING = 'deteriorating',
  DISCHARGE_PENDING = 'discharge_pending',
  DISCHARGED = 'discharged',
}

/**
 * Alert priority for device monitoring
 */
export enum AlertPriority {
  /** Informational only */
  INFO = 'info',
  /** Prompt attention needed */
  WARNING = 'warning',
  /** Immediate action required */
  CRITICAL = 'critical',
}

/**
 * Medical device types
 */
export enum MedicalDeviceType {
  PATIENT_MONITOR = 'patient_monitor',
  VENTILATOR = 'ventilator',
  INFUSION_PUMP = 'infusion_pump',
  DEFIBRILLATOR = 'defibrillator',
  ECG_MACHINE = 'ecg_machine',
  PULSE_OXIMETER = 'pulse_oximeter',
  BLOOD_PRESSURE_MONITOR = 'blood_pressure_monitor',
  GLUCOSE_MONITOR = 'glucose_monitor',
  DIALYSIS_MACHINE = 'dialysis_machine',
  ANESTHESIA_MACHINE = 'anesthesia_machine',
  X_RAY = 'x_ray',
  CT_SCANNER = 'ct_scanner',
  MRI = 'mri',
  ULTRASOUND = 'ultrasound',
  OTHER = 'other',
}
