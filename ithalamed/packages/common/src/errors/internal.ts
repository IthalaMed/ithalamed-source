import { BaseError } from './base.error';
import { ErrorCodes } from './error-codes';

/**
 * Internal error - thrown for unexpected server errors
 */
export class InternalError extends BaseError {
  constructor(message?: string, originalError?: Error) {
    super(
      ErrorCodes. INTERNAL_ERROR,
      message || 'An unexpected error occurred',
      500,
      false, // Not operational - indicates a bug
      { originalError:  originalError?. message },
    );

    Object.setPrototypeOf(this, InternalError.prototype);
  }

  /**
   * Database error
   */
  static database(message?: string): InternalError {
    return new InternalError(message || 'Database operation failed');
  }

  /**
   * External service error
   */
  static externalService(serviceName: string): InternalError {
    return new InternalError(`External service '${serviceName}' is unavailable`);
  }
}
