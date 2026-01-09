/**
 * Standard service response interface
 */
export interface IServiceResponse<T = unknown> {
  /** Whether the operation was successful */
  success:  boolean;

  /** Response data */
  data?: T;

  /** Human-readable message */
  message?: string;

  /** Error information */
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Create a success response
 */
export function createSuccessResponse<T>(data: T, message?: string): IServiceResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

/**
 * Create an error response
 */
export function createErrorResponse(
  code:  string,
  message: string,
  details?: unknown,
): IServiceResponse<never> {
  return {
    success: false,
    error:  {
      code,
      message,
      details,
    },
  };
}
