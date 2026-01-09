import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { User } from './user.entity';

/**
 * Refresh Token Entity
 * 
 * Stores refresh tokens for JWT token refresh flow.
 * Implements token rotation for security.
 */
@Entity('refresh_tokens')
@Index(['userId'])
@Index(['token'], { unique: true })
@Index(['expiresAt'])
@Index(['isRevoked'])
@Index(['familyId'])
export class RefreshToken extends BaseEntity {
  /**
   * User ID
   */
  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId: string;

  /**
   * Refresh token (hashed)
   */
  @Column({
    name: 'token',
    type: 'varchar',
    length: 255,
    unique: true,
  })
  token: string;

  /**
   * Token expiry time
   */
  @Column({
    name: 'expires_at',
    type: 'timestamp with time zone',
  })
  expiresAt: Date;

  /**
   * Whether token is revoked
   */
  @Column({
    name: 'is_revoked',
    type: 'boolean',
    default: false,
  })
  isRevoked: boolean;

  /**
   * Revocation timestamp
   */
  @Column({
    name: 'revoked_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  revokedAt: Date | null;

  /**
   * Revocation reason
   */
  @Column({
    name: 'revocation_reason',
    type: 'varchar',
    length: 100,
    nullable:  true,
  })
  revocationReason: string | null;

  /**
   * Token family ID (for rotation detection)
   */
  @Column({
    name: 'family_id',
    type: 'uuid',
  })
  familyId: string;

  /**
   * Associated session ID
   */
  @Column({
    name: 'session_id',
    type: 'uuid',
    nullable: true,
  })
  sessionId: string | null;

  /**
   * IP address when token was issued
   */
  @Column({
    name: 'ip_address',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  ipAddress: string | null;

  /**
   * User agent when token was issued
   */
  @Column({
    name: 'user_agent',
    type: 'text',
    nullable: true,
  })
  userAgent: string | null;

  /**
   * Replaced by token ID (for rotation tracking)
   */
  @Column({
    name: 'replaced_by',
    type: 'uuid',
    nullable: true,
  })
  replacedBy: string | null;

  // Relationships
  @ManyToOne(() => User, user => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Helper methods
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return ! this.isRevoked && ! this.isExpired();
  }
}
