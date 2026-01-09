import { PaginationParams, PaginatedResponse } from '../types/pagination.type';

/**
 * Base repository interface for common CRUD operations
 */
export interface IBaseRepository<T, CreateDto, UpdateDto> {
  /**
   * Find entity by ID
   */
  findById(id: string): Promise<T | null>;

  /**
   * Find all entities with pagination
   */
  findAll(params?: PaginationParams): Promise<PaginatedResponse<T>>;

  /**
   * Create a new entity
   */
  create(data: CreateDto): Promise<T>;

  /**
   * Update an existing entity
   */
  update(id: string, data: UpdateDto): Promise<T | null>;

  /**
   * Delete an entity (soft delete if supported)
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if entity exists
   */
  exists(id: string): Promise<boolean>;

  /**
   * Count total entities
   */
  count(filter?:  Partial<T>): Promise<number>;
}

/**
 * Repository with soft delete support
 */
export interface ISoftDeleteRepository<T, CreateDto, UpdateDto>
  extends IBaseRepository<T, CreateDto, UpdateDto> {
  /**
   * Soft delete an entity
   */
  softDelete(id: string): Promise<boolean>;

  /**
   * Restore a soft-deleted entity
   */
  restore(id: string): Promise<T | null>;

  /**
   * Find all including soft-deleted
   */
  findAllWithDeleted(params?: PaginationParams): Promise<PaginatedResponse<T>>;

  /**
   * Find only soft-deleted entities
   */
  findDeleted(params?: PaginationParams): Promise<PaginatedResponse<T>>;
}
