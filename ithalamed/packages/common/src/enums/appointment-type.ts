/**
 * Types of appointments
 */
export enum AppointmentType {
  /** In-person consultation */
  IN_PERSON = 'in_person',
  
  /** Video telemedicine consultation */
  TELEMEDICINE_VIDEO = 'telemedicine_video',
  
  /** Audio-only telemedicine consultation */
  TELEMEDICINE_AUDIO = 'telemedicine_audio',
  
  /** Home visit */
  HOME_VISIT = 'home_visit',
  
  /** Follow-up appointment */
  FOLLOW_UP = 'follow_up',
  
  /** Routine checkup */
  ROUTINE_CHECKUP = 'routine_checkup',
  
  /** Emergency consultation */
  EMERGENCY = 'emergency',
  
  /** Procedure/Surgery */
  PROCEDURE = 'procedure',
  
  /** Laboratory visit */
  LAB_VISIT = 'lab_visit',
  
  /** Imaging/Radiology */
  IMAGING = 'imaging',
}
