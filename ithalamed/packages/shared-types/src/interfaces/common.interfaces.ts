/**
 * Address Interface
 */
export interface Address {
  street: string;
  unit?:  string;
  suburb:  string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Pagination Parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * API Response Wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data:  T;
  message?: string;
  timestamp:  string;
  path?:  string;
}

/**
 * API Error Response
 */
export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  error?: string;
  errors?: string[];
  timestamp: string;
  path?: string;
}

/**
 * Message Response (for simple success messages)
 */
export interface MessageResponse {
  message: string;
}
