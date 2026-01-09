/**
 * Status of an appointment
 */
export enum AppointmentStatus {
  /** Appointment has been requested but not confirmed */
  REQUESTED = 'requested',
  
  /** Appointment is scheduled/confirmed */
  SCHEDULED = 'scheduled',
  
  /** Appointment has been confirmed by patient */
  CONFIRMED = 'confirmed',
  
  /** Patient has checked in */
  CHECKED_IN = 'checked_in',
  
  /** Consultation is in progress */
  IN_PROGRESS = 'in_progress',
  
  /** Appointment has been completed */
  COMPLETED = 'completed',
  
  /** Appointment was cancelled */
  CANCELLED = 'cancelled',
  
  /** Patient did not show up */
  NO_SHOW = 'no_show',
  
  /** Appointment was rescheduled */
  RESCHEDULED = 'rescheduled',
}

/**
 * Check if appointment can be cancelled
 */
export function canCancelAppointment(status: AppointmentStatus): boolean {
  return [
    AppointmentStatus.REQUESTED,
    AppointmentStatus.SCHEDULED,
    AppointmentStatus.CONFIRMED,
  ].includes(status);
}

/**
 * Check if appointment can be rescheduled
 */
export function canRescheduleAppointment(status: AppointmentStatus): boolean {
  return [
    AppointmentStatus.SCHEDULED,
    AppointmentStatus.CONFIRMED,
  ]. includes(status);
}
