/**
 * Emergency Services Enums
 * 
 * Based on requirements from ithalamed_overview2.txt (EMS Operations System)
 * and ithalamed_frd_document.txt (FR-PAT-040 through FR-PAT-047)
 */

/**
 * Emergency Severity Index (ESI) Triage Levels
 * Used in Emergency Department (ED) Module
 */
export enum ESITriageLevel {
  /** Life-threatening - Immediate response */
  LEVEL_1_RESUSCITATION = 1,
  /** Emergent - <10 minutes response time */
  LEVEL_2_EMERGENT = 2,
  /** Urgent - <30 minutes response time */
  LEVEL_3_URGENT = 3,
  /** Less Urgent - <60 minutes response time */
  LEVEL_4_LESS_URGENT = 4,
  /** Non-urgent - <120 minutes response time */
  LEVEL_5_NON_URGENT = 5,
}

/**
 * Emergency request types from patient app
 */
export enum EmergencyType {
  MEDICAL = 'medical',
  ACCIDENT = 'accident',
  TRAUMA = 'trauma',
  PREGNANCY = 'pregnancy',
  CARDIAC = 'cardiac',
  RESPIRATORY = 'respiratory',
  STROKE = 'stroke',
  POISONING = 'poisoning',
  BURNS = 'burns',
  OTHER = 'other',
}

/**
 * Emergency severity levels for ambulance requests
 */
export enum EmergencySeverity {
  CRITICAL = 'critical',
  URGENT = 'urgent',
  NON_URGENT = 'non_urgent',
}

/**
 * Emergency request status
 */
export enum EmergencyRequestStatus {
  PENDING = 'pending',
  DISPATCHED = 'dispatched',
  EN_ROUTE = 'en_route',
  ON_SCENE = 'on_scene',
  TRANSPORTING = 'transporting',
  AT_HOSPITAL = 'at_hospital',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Ambulance unit types
 */
export enum AmbulanceUnitType {
  /** Basic Life Support */
  BLS = 'bls',
  /** Advanced Life Support */
  ALS = 'als',
  /** Critical Care Transport */
  CCT = 'cct',
  /** Neonatal Transport */
  NEONATAL = 'neonatal',
  /** First Responder (Motorcycle/Bicycle) */
  FIRST_RESPONDER = 'first_responder',
  /** Non-Emergency Transport */
  NON_EMERGENCY = 'non_emergency',
}

/**
 * Ambulance unit status
 */
export enum AmbulanceUnitStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  STANDBY = 'standby',
  OUT_OF_SERVICE = 'out_of_service',
  RETURNING = 'returning',
}

/**
 * Paramedic certification levels
 */
export enum ParamedicCertificationLevel {
  EMT_BASIC = 'emt_basic',
  EMT_INTERMEDIATE = 'emt_intermediate',
  PARAMEDIC = 'paramedic',
  CRITICAL_CARE_PARAMEDIC = 'critical_care_paramedic',
}

/**
 * ABCDE Assessment components
 */
export enum ABCDEComponent {
  AIRWAY = 'airway',
  BREATHING = 'breathing',
  CIRCULATION = 'circulation',
  DISABILITY = 'disability',
  EXPOSURE = 'exposure',
}

/**
 * Glasgow Coma Scale (GCS) components
 */
export enum GCSComponent {
  EYE_OPENING = 'eye_opening',
  VERBAL_RESPONSE = 'verbal_response',
  MOTOR_RESPONSE = 'motor_response',
}
