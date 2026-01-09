import { BaseError } from './base.error';
import { ErrorCode, ErrorCodes } from './error-codes';

/**
 * Not found error - thrown when a requested resource doesn't exist
 */
export class NotFoundError extends BaseError {
  public readonly resource: string;
  public readonly resourceId?: string;

  constructor(resource: string, resourceId?: string, code?: ErrorCode) {
    const message = resourceId
      ? `${resource} with ID '${resourceId}' not found`
      : `${resource} not found`;

    super(code || ErrorCodes.NOT_FOUND, message, 404, true, { resource, resourceId });

    this.resource = resource;
    this.resourceId = resourceId;

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  /**
   * Create user not found error
   */
  static user(userId?:  string): NotFoundError {
    return new NotFoundError('User', userId, ErrorCodes.USER_NOT_FOUND);
  }

  /**
   * Create patient not found error
   */
  static patient(patientId?: string): NotFoundError {
    return new NotFoundError('Patient', patientId, ErrorCodes.PATIENT_NOT_FOUND);
  }

  /**
   * Create provider not found error
   */
  static provider(providerId?: string): NotFoundError {
    return new NotFoundError('Provider', providerId, ErrorCodes.PROVIDER_NOT_FOUND);
  }

  /**
   * Create appointment not found error
   */
  static appointment(appointmentId?: string): NotFoundError {
    return new NotFoundError('Appointment', appointmentId, ErrorCodes. APPOINTMENT_NOT_FOUND);
  }

  /**
   * Create prescription not found error
   */
  static prescription(prescriptionId?: string): NotFoundError {
    return new NotFoundError('Prescription', prescriptionId, ErrorCodes.PRESCRIPTION_NOT_FOUND);
  }
}
