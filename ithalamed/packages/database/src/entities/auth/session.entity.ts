import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../base/base. entity';
import { User } from './user.entity';

/**
 * Session Entity
 * 
 * Tracks active user sessions for security and audit purposes.
 * Supports multiple device sessions with configurable limits.
 */
@Entity('sessions')
@Index(['userId'])
@Index(['token'], { unique: true })
@Index(['expiresAt'])
@Index(['isActive'])
@Index(['deviceId'])
export class Session extends BaseEntity {
  /**
   * User ID
   */
  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId: string;

  /**
   * Session token (hashed)
   */
  @Column({
    name: 'token',
    type: 'varchar',
    length: 255,
    unique: true,
  })
  token: string;

  /**
   * Session expiry time
   */
  @Column({
    name: 'expires_at',
    type: 'timestamp with time zone',
  })
  expiresAt: Date;

  /**
   * Whether session is active
   */
  @Column({
    name: 'is_active',
    type:  'boolean',
    default:  true,
  })
  isActive: boolean;

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
   * User agent string
   */
  @Column({
    name: 'user_agent',
    type: 'text',
    nullable: true,
  })
  userAgent: string | null;

  /**
   * Device ID (for mobile apps)
   */
  @Column({
    name: 'device_id',
    type:  'varchar',
    length:  255,
    nullable: true,
  })
  deviceId: string | null;

  /**
   * Device type
   */
  @Column({
    name: 'device_type',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  deviceType: string | null;

  /**
   * Device name
   */
  @Column({
    name: 'device_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  deviceName: string | null;

  /**
   * Platform (iOS, Android, Web)
   */
  @Column({
    name: 'platform',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  platform: string | null;

  /**
   * App version
   */
  @Column({
    name: 'app_version',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  appVersion: string | null;

  /**
   * Location (city, country) - derived from IP
   */
  @Column({
    name: 'location',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  location: string | null;

  /**
   * Last activity timestamp
   */
  @Column({
    name: 'last_activity_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastActivityAt: Date;

  /**
   * MFA verified for this session
   */
  @Column({
    name: 'mfa_verified',
    type: 'boolean',
    default: false,
  })
  mfaVerified: boolean;

  /**
   * MFA verified timestamp
   */
  @Column({
    name: 'mfa_verified_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  mfaVerifiedAt: Date | null;

  /**
   * Termination reason (if session ended)
   */
  @Column({
    name: 'termination_reason',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  terminationReason: string | null;

  /**
   * Terminated at timestamp
   */
  @Column({
    name: 'terminated_at',
    type:  'timestamp with time zone',
    nullable: true,
  })
  terminatedAt: Date | null;

  // Relationships
  @ManyToOne(() => User, user => user. sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Helper methods
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return this.isActive && !this.isExpired();
  }
}
