/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  /** Whether the request was successful */
  success: boolean;
  
  /** Response data */
  data?: T;
  
  /** Human-readable message */
  message?:  string;
  
  /** Error details (if success is false) */
  error?: ApiError;
  
  /** Request metadata */
  meta?: {
    /** Request ID for tracing */
    requestId:  string;
    
    /** Response timestamp */
    timestamp: string;
    
    /** API version */
    version?:  string;
  };
}

/**
 * API error structure
 */
export interface ApiError {
  /** Error code */
  code: string;
  
  /** Error message */
  message: string;
  
  /** HTTP status code */
  statusCode:  number;
  
  /** Field-specific validation errors */
  errors?: FieldError[];
  
  /** Stack trace (only in development) */
  stack?: string;
}

/**
 * Field-specific validation error
 */
export interface FieldError {
  /** Field name */
  field:  string;
  
  /** Error message */
  message: string;
  
  /** Invalid value (sanitized) */
  value?: unknown;
  
  /** Validation rule that failed */
  rule?: string;
}

/**
 * Create success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    meta: {
      requestId: generateRequestId(),
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Create error response
 */
export function createErrorResponse(
  code: string,
  message:  string,
  statusCode: number,
  errors?: FieldError[],
): ApiResponse<never> {
  return {
    success:  false,
    error: {
      code,
      message,
      statusCode,
      errors,
    },
    meta: {
      requestId: generateRequestId(),
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Generate request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
