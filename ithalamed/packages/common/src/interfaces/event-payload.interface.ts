/**
 * Base event payload interface for inter-service communication
 */
export interface IEventPayload {
  /** Unique event ID */
  eventId: string;

  /** Event type identifier */
  eventType: string;

  /** Event timestamp */
  timestamp: Date;

  /** Event schema version */
  version: string;

  /** Correlation ID for distributed tracing */
  correlationId?:  string;

  /** User who triggered the event */
  triggeredBy?: string;

  /** Source service */
  source: string;
}

/**
 * User registered event payload
 */
export interface IUserRegisteredEvent extends IEventPayload {
  eventType: 'user.registered';
  data: {
    userId: string;
    email: string;
    userType: string;
    phoneNumber?: string;
  };
}

/**
 * User login event payload
 */
export interface IUserLoginEvent extends IEventPayload {
  eventType: 'user.login';
  data: {
    userId: string;
    email: string;
    ipAddress:  string;
    userAgent: string;
    sessionId: string;
  };
}

/**
 * Patient created event payload
 */
export interface IPatientCreatedEvent extends IEventPayload {
  eventType: 'patient.created';
  data: {
    patientId: string;
    patientNumber: string;
    userId?:  string;
    firstName:  string;
    lastName: string;
  };
}

/**
 * Patient updated event payload
 */
export interface IPatientUpdatedEvent extends IEventPayload {
  eventType: 'patient.updated';
  data: {
    patientId: string;
    updatedFields: string[];
  };
}

/**
 * Appointment booked event payload
 */
export interface IAppointmentBookedEvent extends IEventPayload {
  eventType: 'appointment.booked';
  data: {
    appointmentId: string;
    appointmentNumber: string;
    patientId: string;
    providerId:  string;
    facilityId: string;
    scheduledAt: Date;
    appointmentType: string;
  };
}

/**
 * Appointment cancelled event payload
 */
export interface IAppointmentCancelledEvent extends IEventPayload {
  eventType: 'appointment. cancelled';
  data: {
    appointmentId: string;
    patientId: string;
    providerId: string;
    reason: string;
    cancelledBy:  string;
  };
}

/**
 * Prescription created event payload
 */
export interface IPrescriptionCreatedEvent extends IEventPayload {
  eventType: 'prescription. created';
  data: {
    prescriptionId: string;
    prescriptionNumber: string;
    patientId: string;
    providerId: string;
    medicationCount: number;
  };
}

/**
 * Prescription dispensed event payload
 */
export interface IPrescriptionDispensedEvent extends IEventPayload {
  eventType: 'prescription.dispensed';
  data: {
    prescriptionId: string;
    pharmacyId: string;
    pharmacistId: string;
    dispensedAt: Date;
  };
}

/**
 * Emergency request event payload
 */
export interface IEmergencyRequestEvent extends IEventPayload {
  eventType: 'emergency.requested';
  data: {
    emergencyId: string;
    patientId: string;
    emergencyType: string;
    severity: string;
    location: {
      latitude: number;
      longitude: number;
      address?:  string;
    };
  };
}

/**
 * Notification request event payload
 */
export interface INotificationRequestEvent extends IEventPayload {
  eventType:  'notification.send';
  data: {
    recipientId: string;
    recipientType: 'user' | 'patient' | 'provider';
    channels: ('push' | 'sms' | 'email' | 'whatsapp')[];
    templateId: string;
    templateData: Record<string, unknown>;
    priority: 'low' | 'normal' | 'high' | 'critical';
  };
}

/**
 * Union type of all event payloads
 */
export type EventPayload =
  | IUserRegisteredEvent
  | IUserLoginEvent
  | IPatientCreatedEvent
  | IPatientUpdatedEvent
  | IAppointmentBookedEvent
  | IAppointmentCancelledEvent
  | IPrescriptionCreatedEvent
  | IPrescriptionDispensedEvent
  | IEmergencyRequestEvent
  | INotificationRequestEvent;
