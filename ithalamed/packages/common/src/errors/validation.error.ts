import { BaseError } from './base.error';
import { ErrorCodes } from './error-codes';

/**
 * Field validation error details
 */
export interface ValidationFieldError {
  field: string;
  message: string;
  value?:  unknown;
  constraint?: string;
}

/**
 * Validation error - thrown when request validation fails
 */
export class ValidationError extends BaseError {
  public readonly fieldErrors: ValidationFieldError[];

  constructor(fieldErrors: ValidationFieldError[], message?: string) {
    super(
      ErrorCodes.VALIDATION_ERROR,
      message || 'Validation failed',
      400,
      true,
      { fieldErrors },
    );

    this.fieldErrors = fieldErrors;

    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  /**
   * Create from class-validator errors
   */
  static fromClassValidator(errors: Array<{
    property: string;
    constraints?:  Record<string, string>;
    value?: unknown;
  }>): ValidationError {
    const fieldErrors: ValidationFieldError[] = errors.map(error => ({
      field: error.property,
      message: error.constraints
        ? Object.values(error.constraints)[0]
        : 'Invalid value',
      value: error. value,
      constraint: error.constraints
        ? Object.keys(error.constraints)[0]
        : undefined,
    }));

    return new ValidationError(fieldErrors);
  }

  /**
   * Create a single field error
   */
  static field(field: string, message: string, value?: unknown): ValidationError {
    return new ValidationError([{ field, message, value }]);
  }

  toJSON(): Record<string, unknown> {
    return {
      ... super.toJSON(),
      errors: this.fieldErrors,
    };
  }
}
