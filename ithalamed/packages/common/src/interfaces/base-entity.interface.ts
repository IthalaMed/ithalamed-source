/**
 * Base entity interface that all entities should implement
 */
export interface IBaseEntity {
  /** Unique identifier (UUID) */
  id: string;

  /** Creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Base entity with soft delete support
 */
export interface ISoftDeletableEntity extends IBaseEntity {
  /** Soft delete timestamp (null if not deleted) */
  deletedAt: Date | null;
}

/**
 * Base entity with audit fields
 */
export interface IAuditableEntity extends IBaseEntity {
  /** User who created the record */
  createdBy?:  string;

  /** User who last updated the record */
  updatedBy?: string;
}

/**
 * Full base entity with all fields
 */
export interface IFullBaseEntity extends IBaseEntity, ISoftDeletableEntity, IAuditableEntity {}
