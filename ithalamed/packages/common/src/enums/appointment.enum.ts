/**
 * Appointment Enums
 * 
 * Based on ithalamed_frd_document.txt (Section 2.3 Appointments Module)
 */

/**
 * Appointment types
 */
export enum AppointmentType {
  /** Standard consultation */
  CONSULTATION = 'consultation',
  /** Follow-up visit */
  FOLLOW_UP = 'follow_up',
  /** Medical procedure */
  PROCEDURE = 'procedure',
  /** Laboratory visit */
  LAB = 'lab',
  /** Imaging/Radiology */
  IMAGING = 'imaging',
  /** Vaccination */
  VACCINATION = 'vaccination',
  /** Health screening */
  SCREENING = 'screening',
  /** Pre-operative assessment */
  PRE_OPERATIVE = 'pre_operative',
  /** Post-operative check */
  POST_OPERATIVE = 'post_operative',
  /** Annual physical/checkup */
  ANNUAL_CHECKUP = 'annual_checkup',
  /** Telemedicine consultation */
  TELEMEDICINE = 'telemedicine',
  /** Home visit */
  HOME_VISIT = 'home_visit',
  /** Emergency (walk-in) */
  EMERGENCY = 'emergency',
  /** Second opinion */
  SECOND_OPINION = 'second_opinion',
}

/**
 * Appointment status
 */
export enum AppointmentStatus {
  /** Appointment scheduled but not confirmed */
  SCHEDULED = 'scheduled',
  /** Appointment confirmed by patient */
  CONFIRMED = 'confirmed',
  /** Patient has checked in */
  CHECKED_IN = 'checked_in',
  /** Consultation in progress */
  IN_PROGRESS = 'in_progress',
  /** Consultation completed */
  COMPLETED = 'completed',
  /** Appointment cancelled */
  CANCELLED = 'cancelled',
  /** Patient did not show up */
  NO_SHOW = 'no_show',
  /** Appointment rescheduled (links to new appointment) */
  RESCHEDULED = 'rescheduled',
}

/**
 * Appointment priority
 */
export enum AppointmentPriority {
  ROUTINE = 'routine',
  URGENT = 'urgent',
  EMERGENCY = 'emergency',
}

/**
 * Consultation mode
 */
export enum ConsultationMode {
  /** In-person at facility */
  IN_PERSON = 'in_person',
  /** Video consultation */
  VIDEO = 'video',
  /** Audio-only call */
  AUDIO = 'audio',
  /** Chat/messaging */
  CHAT = 'chat',
}

/**
 * Appointment cancellation reasons
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
 * Check-in method
 */
export enum CheckInMethod {
  /** QR code scan */
  QR_CODE = 'qr_code',
  /** Geo-fence auto check-in */
  GEO_FENCE = 'geo_fence',
  /** Manual check-in by staff */
  MANUAL = 'manual',
  /** Kiosk check-in */
  KIOSK = 'kiosk',
  /** Mobile app check-in */
  MOBILE_APP = 'mobile_app',
}
