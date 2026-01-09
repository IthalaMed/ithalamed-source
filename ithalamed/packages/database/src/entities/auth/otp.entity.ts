import {
  Entity,
  Column,
  Index,
} from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { OtpPurpose, OtpChannel } from '@ithalamed/common';

@Entity('otps')
@Index(['userId'])
@Index(['identifier', 'purpose'])
@Index(['expiresAt'])
export class Otp extends BaseEntity {
  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: true,
    comment: 'User ID if OTP is for existing user',
  })
  userId: string | null;

  @Column({
    name: 'identifier',
    type: 'varchar',
    length: 255,
    comment: 'Email or phone number the OTP was sent to',
  })
  identifier: string;

  @Column({
    name: 'code_hash',
    type: 'varchar',
    length: 255,
    comment: 'Hashed OTP code',
  })
  codeHash: string;

  @Column({
    name: 'purpose',
    type: 'enum',
    enum: OtpPurpose,
  })
  purpose: OtpPurpose;

  @Column({
    name: 'channel',
    type: 'enum',
    enum: OtpChannel,
  })
  channel: OtpChannel;

  @Column({
    name: 'expires_at',
    type: 'timestamp with time zone',
  })
  expiresAt: Date;

  @Column({
    name: 'attempts',
    type: 'smallint',
    default: 0,
  })
  attempts: number;

  @Column({
    name: 'max_attempts',
    type: 'smallint',
    default:  5,
  })
  maxAttempts: number;

  @Column({
    name: 'is_used',
    type: 'boolean',
    default: false,
  })
  isUsed: boolean;

  @Column({
    name: 'used_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  usedAt: Date | null;

  @Column({
    name: 'ip_address',
    type:  'varchar',
    length:  45,
    nullable: true,
  })
  ipAddress: string | null;

  // Helper methods
  isValid(): boolean {
    return !this.isUsed && this.expiresAt > new Date() && this.attempts < this.maxAttempts;
  }

  hasExceededAttempts(): boolean {
    return this.attempts >= this.maxAttempts;
  }

  isExpired(): boolean {
    return this.expiresAt < new Date();
  }
}
