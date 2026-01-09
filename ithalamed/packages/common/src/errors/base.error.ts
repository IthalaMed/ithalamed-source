import { ErrorCode, getErrorMessage } from './error-codes';

/**
 * Base error class for all custom errors
 */
export class BaseError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode:  number;
  public readonly isOperational: boolean;
  public readonly details?:  unknown;
  public readonly timestamp: Date;

  constructor(
    code: ErrorCode,
    message?:  string,
    statusCode = 500,
    isOperational = true,
    details?: unknown,
  ) {
    super(message || getErrorMessage(code));
    
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    this.timestamp = new Date();

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly
    Object.setPrototypeOf(this, BaseError.prototype);
  }

  /**
   * Convert error to JSON for API responses
   */
  toJSON(): Record<string, unknown> {
    return {
      code: this. code,
      message: this. message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
    };
  }
}
