import { BaseError } from './base.error';
import { ErrorCode, ErrorCodes } from './error-codes';

/**
 * Unauthorized error - thrown when authentication fails
 */
export class UnauthorizedError extends BaseError {
  constructor(code?: ErrorCode, message?: string) {
    super(
      code || ErrorCodes.AUTH_TOKEN_INVALID,
      message || 'Unauthorized',
      401,
      true,
    );

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  /**
   * Invalid credentials error
   */
  static invalidCredentials(): UnauthorizedError {
    return new UnauthorizedError(ErrorCodes.AUTH_INVALID_CREDENTIALS);
  }

  /**
   * Token expired error
   */
  static tokenExpired(): UnauthorizedError {
    return new UnauthorizedError(ErrorCodes.AUTH_TOKEN_EXPIRED);
  }

  /**
   * Invalid token error
   */
  static invalidToken(): UnauthorizedError {
    return new UnauthorizedError(ErrorCodes.AUTH_TOKEN_INVALID);
  }

  /**
   * MFA required error
   */
  static mfaRequired(): UnauthorizedError {
    return new UnauthorizedError(
      ErrorCodes.AUTH_MFA_REQUIRED,
      'Multi-factor authentication is required',
    );
  }

  /**
   * Invalid MFA code error
   */
  static invalidMfa(): UnauthorizedError {
    return new UnauthorizedError(ErrorCodes.AUTH_MFA_INVALID);
  }

  /**
   * Account locked error
   */
  static accountLocked(): UnauthorizedError {
    return new UnauthorizedError(ErrorCodes.AUTH_ACCOUNT_LOCKED);
  }

  /**
   * Account not verified error
   */
  static accountNotVerified(): UnauthorizedError {
    return new UnauthorizedError(ErrorCodes.AUTH_ACCOUNT_NOT_VERIFIED);
  }

  /**
   * Session expired error
   */
  static sessionExpired(): UnauthorizedError {
    return new UnauthorizedError(ErrorCodes.AUTH_SESSION_EXPIRED);
  }
}
