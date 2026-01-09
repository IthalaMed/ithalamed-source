/**
 * Pagination parameters for requests
 */
export interface PaginationParams {
  /** Page number (1-based) */
  page?:  number;
  
  /** Number of items per page */
  limit?: number;
  
  /** Number of items to skip */
  offset?: number;
  
  /** Sort field */
  sortBy?: string;
  
  /** Sort order */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /** Data items */
  data:  T[];
  
  /** Pagination metadata */
  pagination: {
    /** Total number of items */
    total:  number;
    
    /** Current page (1-based) */
    page: number;
    
    /** Items per page */
    limit: number;
    
    /** Total number of pages */
    totalPages: number;
    
    /** Whether there are more pages */
    hasMore: boolean;
    
    /** Whether there is a previous page */
    hasPrevious: boolean;
  };
}

/**
 * Create pagination metadata
 */
export function createPaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginatedResponse<never>['pagination'] {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasMore: page < totalPages,
    hasPrevious: page > 1,
  };
}

/**
 * Calculate offset from page and limit
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}
