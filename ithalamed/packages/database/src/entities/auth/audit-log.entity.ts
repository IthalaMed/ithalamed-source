import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditAction } from '@ithalamed/common';

/**
 * Audit Log Entity
 * 
 * Immutable audit trail for security and compliance.
 * Based on security requirements from ithalamed_overview.txt.
 */
@Entity('audit_logs')
@Index(['userId'])
@Index(['action'])
@Index(['resourceType', 'resourceId'])
@Index(['createdAt'])
@Index(['sessionId'])
@Index(['requestId'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Action performed
   */
  @Column({
    name: 'action',
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  /**
   * User who performed the action
   */
  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: true,
  })
  userId: string | null;

  /**
   * User type at time of action
   */
  @Column({
    name: 'user_type',
    type: 'varchar',
    length: 50,
    nullable:  true,
  })
  userType: string | null;

  /**
   * Resource type (e.g., 'user', 'patient', 'session')
   */
  @Column({
    name: 'resource_type',
    type: 'varchar',
    length: 100,
  })
  resourceType: string;

  /**
   * Resource ID
   */
  @Column({
    name: 'resource_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  resourceId: string | null;

  /**
   * IP address
   */
  @Column({
    name: 'ip_address',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  ipAddress: string | null;

  /**
   * User agent
   */
  @Column({
    name: 'user_agent',
    type:  'text',
    nullable:  true,
  })
  userAgent: string | null;

  /**
   * Request ID for correlation
   */
  @Column({
    name: 'request_id',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  requestId: string | null;

  /**
   * Session ID
   */
  @Column({
    name: 'session_id',
    type: 'uuid',
    nullable: true,
  })
  sessionId: string | null;

  /**
   * Previous state (for updates)
   */
  @Column({
    name: 'previous_state',
    type: 'jsonb',
    nullable: true,
  })
  previousState: Record<string, unknown> | null;

  /**
   * New state (for creates/updates)
   */
  @Column({
    name: 'new_state',
    type:  'jsonb',
    nullable: true,
  })
  newState: Record<string, unknown> | null;

  /**
   * Additional metadata
   */
  @Column({
    name: 'metadata',
    type: 'jsonb',
    default: {},
  })
  metadata: Record<string, unknown>;

  /**
   * Whether action was successful
   */
  @Column({
    name: 'success',
    type: 'boolean',
    default: true,
  })
  success: boolean;

  /**
   * Error message if failed
   */
  @Column({
    name: 'error_message',
    type: 'text',
    nullable: true,
  })
  errorMessage: string | null;

  /**
   * Timestamp (immutable)
   */
  @Column({
    name: 'created_at',
    type:  'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
