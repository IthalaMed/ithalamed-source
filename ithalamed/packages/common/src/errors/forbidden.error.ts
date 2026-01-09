import { BaseError } from './base.error';
import { ErrorCodes } from './error-codes';

/**
 * Forbidden error - thrown when user doesn't have permission
 */
export class ForbiddenError extends BaseError {
  public readonly requiredPermission?:  string;
  public readonly resource?: string;

  constructor(message?: string, requiredPermission?:  string, resource?: string) {
    super(
      ErrorCodes.FORBIDDEN,
      message || 'You do not have permission to perform this action',
      403,
      true,
      { requiredPermission, resource },
    );

    this.requiredPermission = requiredPermission;
    this.resource = resource;

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  /**
   * Create forbidden error for missing permission
   */
  static missingPermission(permission:  string): ForbiddenError {
    return new ForbiddenError(
      `Missing required permission: ${permission}`,
      permission,
    );
  }

  /**
   * Create forbidden error for resource access
   */
  static cannotAccess(resource: string): ForbiddenError {
    return new ForbiddenError(
      `You do not have permission to access this ${resource}`,
      undefined,
      resource,
    );
  }

  /**
   * Create forbidden error for account suspended
   */
  static accountSuspended(): ForbiddenError {
    return new ForbiddenError('Your account has been suspended');
  }
}
