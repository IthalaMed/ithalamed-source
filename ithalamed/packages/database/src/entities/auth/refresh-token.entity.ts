import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../base/base. entity';
import { User } from './user.entity';

@Entity('refresh_tokens')
@Index(['userId'])
@Index(['token'], { unique: true })
@Index(['expiresAt'])
@Index(['isRevoked'])
export class RefreshToken extends BaseEntity {
  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId: string;

  @Column({
    name: 'session_id',
    type: 'uuid',
  })
  sessionId: string;

  @Column({
    name: 'token',
    type: 'varchar',
    length: 500,
    unique: true,
  })
  token: string;

  @Column({
    name: 'token_hash',
    type: 'varchar',
    length: 255,
    comment: 'SHA256 hash of the token for secure comparison',
  })
  tokenHash: string;

  @Column({
    name: 'expires_at',
    type: 'timestamp with time zone',
  })
  expiresAt: Date;

  @Column({
    name: 'is_revoked',
    type:  'boolean',
    default:  false,
  })
  isRevoked: boolean;

  @Column({
    name: 'revoked_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  revokedAt: Date | null;

  @Column({
    name: 'replaced_by_token',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Token that replaced this one (for token rotation)',
  })
  replacedByToken: string | null;

  @Column({
    name: 'ip_address',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  ipAddress: string | null;

  @Column({
    name: 'user_agent',
    type: 'text',
    nullable: true,
  })
  userAgent: string | null;

  // Relationships
  @ManyToOne(() => User, user => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Helper methods
  isValid(): boolean {
    return ! this.isRevoked && this. expiresAt > new Date();
  }
}
