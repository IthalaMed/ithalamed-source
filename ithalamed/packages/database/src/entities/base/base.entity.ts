import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  BaseEntity as TypeOrmBaseEntity,
} from 'typeorm';

/**
 * Abstract base entity with common fields for all entities
 */
export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
  })
  updatedAt: Date;
}

/**
 * Base entity with soft delete support
 */
export abstract class SoftDeletableEntity extends BaseEntity {
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt:  Date | null;
}

/**
 * Base entity with audit fields
 */
export abstract class AuditableEntity extends SoftDeletableEntity {
  @Column({
    name: 'created_by',
    type: 'uuid',
    nullable: true,
  })
  createdBy: string | null;

  @Column({
    name: 'updated_by',
    type:  'uuid',
    nullable:  true,
  })
  updatedBy: string | null;
}
