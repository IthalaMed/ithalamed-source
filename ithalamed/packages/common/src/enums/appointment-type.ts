/**
 * Types of appointments
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
