import { BaseError } from './base.error';
import { ErrorCode, ErrorCodes } from './error-codes';

/**
 * Conflict error - thrown when there's a resource conflict
 */
export class ConflictError extends BaseError {
  public readonly conflictField?: string;
  public readonly conflictValue?: unknown;

  constructor(
    message:  string,
    code?: ErrorCode,
    conflictField?: string,
    conflictValue?: unknown,
  ) {
    super(
      code || ErrorCodes.CONFLICT,
      message,
      409,
      true,
      { conflictField, conflictValue },
    );

    this.conflictField = conflictField;
    this.conflictValue = conflictValue;

    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  /**
   * Email already exists
   */
  static emailTaken(email: string): ConflictError {
    return new ConflictError(
      'Email address is already registered',
      ErrorCodes.USER_EMAIL_TAKEN,
      'email',
      email,
    );
  }

  /**
   * Phone number already exists
   */
  static phoneTaken(phone: string): ConflictError {
    return new ConflictError(
      'Phone number is already registered',
      ErrorCodes.USER_PHONE_TAKEN,
      'phoneNumber',
      phone,
    );
  }

  /**
   * ID number already exists
   */
  static idNumberTaken(idNumber: string): ConflictError {
    return new ConflictError(
      'ID number is already registered',
      ErrorCodes. PATIENT_ID_NUMBER_TAKEN,
      'idNumber',
      idNumber. substring(0, 6) + '*******', // Masked for privacy
    );
  }

  /**
   * Appointment slot already booked
   */
  static appointmentSlotTaken(): ConflictError {
    return new ConflictError(
      'This time slot has already been booked',
      ErrorCodes.APPOINTMENT_SLOT_UNAVAILABLE,
    );
  }

  /**
   * User already has appointment at this time
   */
  static duplicateAppointment(): ConflictError {
    return new ConflictError(
      'You already have an appointment at this time',
      ErrorCodes.APPOINTMENT_ALREADY_BOOKED,
    );
  }
}
