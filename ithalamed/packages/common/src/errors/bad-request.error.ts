import { BaseError } from './base. error';
import { ErrorCode, ErrorCodes } from './error-codes';

/**
 * Bad request error - thrown when request is malformed or invalid
 */
export class BadRequestError extends BaseError {
  constructor(message:  string, code?: ErrorCode, details?: unknown) {
    super(code || ErrorCodes.BAD_REQUEST, message, 400, true, details);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  /**
   * Invalid SA ID number format
   */
  static invalidIdNumber(): BadRequestError {
    return new BadRequestError(
      'Invalid South African ID number',
      ErrorCodes.PATIENT_INVALID_ID_NUMBER,
    );
  }

  /**
   * Invalid OTP
   */
  static invalidOtp(): BadRequestError {
    return new BadRequestError('Invalid verification code', ErrorCodes.OTP_INVALID);
  }

  /**
   * OTP expired
   */
  static otpExpired(): BadRequestError {
    return new BadRequestError(
      'Verification code has expired.  Please request a new one',
      ErrorCodes.OTP_EXPIRED,
    );
  }

  /**
   * OTP max attempts exceeded
   */
  static otpMaxAttempts(): BadRequestError {
    return new BadRequestError(
      'Too many failed attempts. Please request a new code',
      ErrorCodes.OTP_MAX_ATTEMPTS,
    );
  }

  /**
   * Appointment cannot be cancelled
   */
  static cannotCancelAppointment(reason: string): BadRequestError {
    return new BadRequestError(
      `Appointment cannot be cancelled: ${reason}`,
      ErrorCodes.APPOINTMENT_CANNOT_CANCEL,
    );
  }

  /**
   * Appointment in the past
   */
  static appointmentInPast(): BadRequestError {
    return new BadRequestError(
      'Cannot book appointments in the past',
      ErrorCodes.APPOINTMENT_IN_PAST,
    );
  }

  /**
   * Prescription expired
   */
  static prescriptionExpired(): BadRequestError {
    return new BadRequestError(
      'This prescription has expired',
      ErrorCodes.PRESCRIPTION_EXPIRED,
    );
  }

  /**
   * Prescription already dispensed
   */
  static prescriptionAlreadyDispensed(): BadRequestError {
    return new BadRequestError(
      'This prescription has already been fully dispensed',
      ErrorCodes.PRESCRIPTION_ALREADY_DISPENSED,
    );
  }
}
