/**
 * Appointment Type Enum
 */
export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  PROCEDURE = 'procedure',
  LAB = 'lab',
  IMAGING = 'imaging',
  VACCINATION = 'vaccination',
  SCREENING = 'screening',
  PRE_OPERATIVE = 'pre_operative',
  POST_OPERATIVE = 'post_operative',
  ANNUAL_CHECKUP = 'annual_checkup',
  TELEMEDICINE = 'telemedicine',
  HOME_VISIT = 'home_visit',
  EMERGENCY = 'emergency',
  SECOND_OPINION = 'second_opinion',
}

/**
 * Appointment Status Enum
 */
export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}

/**
 * Appointment Priority Enum
 */
export enum AppointmentPriority {
  ROUTINE = 'routine',
  URGENT = 'urgent',
  EMERGENCY = 'emergency',
}

/**
 * Consultation Mode Enum
 */
export enum ConsultationMode {
  IN_PERSON = 'in_person',
  VIDEO = 'video',
  AUDIO = 'audio',
  CHAT = 'chat',
}

/**
 * Cancellation Reason Enum
 */
export enum CancellationReason {
  PATIENT_REQUEST = 'patient_request',
  PROVIDER_UNAVAILABLE = 'provider_unavailable',
  SCHEDULE_CONFLICT = 'schedule_conflict',
  FEELING_BETTER = 'feeling_better',
  TRANSPORTATION_ISSUE = 'transportation_issue',
  FINANCIAL_REASON = 'financial_reason',
  EMERGENCY = 'emergency',
  WEATHER = 'weather',
  SYSTEM_ERROR = 'system_error',
  OTHER = 'other',
}

/**
 * Check-in Method Enum
 */
export enum CheckInMethod {
  QR_CODE = 'qr_code',
  GEO_FENCE = 'geo_fence',
  MANUAL = 'manual',
  KIOSK = 'kiosk',
  MOBILE_APP = 'mobile_app',
}
