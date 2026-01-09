import {
  Entity,
  Column,
  Index,
} from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { OtpPurpose } from '@ithalamed/common';

/**
 * OTP Entity
 * 
 * Stores one-time passwords for verification purposes.
 * Implements FR-PAT-002 (2FA with SMS/Email OTP).
 */
@Entity('otps')
@Index(['identifier', 'purpose'])
@Index(['expiresAt'])
@Index(['isUsed'])
export class Otp extends BaseEntity {
  /**
   * User ID (if associated with user)
   */
  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: true,
  })
  userId: string | null;

  /**
   * Identifier (email or phone number)
   */
  @Column({
    name: 'identifier',
    type: 'varchar',
    length: 255,
  })
  identifier: string;

  /**
   * OTP code (hashed)
   */
  @Column({
    name: 'code',
    type: 'varchar',
    length: 255,
  })
  code: string;

  /**
   * OTP purpose
   */
  @Column({
    name: 'purpose',
    type: 'enum',
    enum: OtpPurpose,
  })
  purpose: OtpPurpose;

  /**
   * Expiry timestamp
   */
  @Column({
    name: 'expires_at',
    type: 'timestamp with time zone',
  })
  expiresAt: Date;

  /**
   * Whether OTP has been used
   */
  @Column({
    name: 'is_used',
    type:  'boolean',
    default:  false,
  })
  isUsed: boolean;

  /**
   * Used timestamp
   */
  @Column({
    name: 'used_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  usedAt: Date | null;

  /**
   * Number of verification attempts
   */
  @Column({
    name: 'attempts',
    type: 'smallint',
    default: 0,
  })
  attempts: number;

  /**
   * Maximum allowed attempts
   */
  @Column({
    name: 'max_attempts',
    type: 'smallint',
    default:  5,
  })
  maxAttempts: number;

  /**
   * IP address when OTP was requested
   */
  @Column({
    name: 'ip_address',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  ipAddress: string | null;

  /**
   * User agent when OTP was requested
   */
  @Column({
    name: 'user_agent',
    type: 'text',
    nullable: true,
  })
  userAgent: string | null;

  /**
   * Delivery method
   */
  @Column({
    name: 'delivery_method',
    type: 'varchar',
    length: 20,
    default: 'sms',
  })
  deliveryMethod: 'sms' | 'email' | 'whatsapp';

  /**
   * Delivery status
   */
  @Column({
    name: 'delivery_status',
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  deliveryStatus: 'pending' | 'sent' | 'delivered' | 'failed';

  /**
   * Delivery timestamp
   */
  @Column({
    name: 'delivered_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deliveredAt: Date | null;

  // Helper methods
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return !this.isUsed && !this.isExpired() && this.attempts < this.maxAttempts;
  }

  hasAttemptsRemaining(): boolean {
    return this.attempts < this.maxAttempts;
  }
}
