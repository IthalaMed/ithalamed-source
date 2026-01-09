import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../base/base. entity';
import { User } from './user.entity';
import { DeviceInfo } from '@ithalamed/common';

@Entity('sessions')
@Index(['userId'])
@Index(['token'], { unique: true })
@Index(['expiresAt'])
@Index(['isActive'])
export class Session extends BaseEntity {
  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId: string;

  @Column({
    name:  'token',
    type:  'varchar',
    length:  500,
    unique: true,
  })
  token: string;

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

  @Column({
    name: 'device_info',
    type: 'jsonb',
    nullable: true,
  })
  deviceInfo: DeviceInfo | null;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    name: 'expires_at',
    type: 'timestamp with time zone',
  })
  expiresAt: Date;

  @Column({
    name: 'last_activity_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  lastActivityAt: Date | null;

  @Column({
    name: 'revoked_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  revokedAt: Date | null;

  @Column({
    name: 'revoked_reason',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  revokedReason: string | null;

  // Relationships
  @ManyToOne(() => User, user => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Helper methods
  isValid(): boolean {
    return this. isActive && !this.revokedAt && this.expiresAt > new Date();
  }
}
