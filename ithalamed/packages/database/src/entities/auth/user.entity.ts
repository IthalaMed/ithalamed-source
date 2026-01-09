import {
  Entity,
  Column,
  Index,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { SoftDeletableEntity } from '../base/base.entity';
import { UserType, UserStatus, MfaMethod } from '@ithalamed/common';
import { Session } from './session.entity';
import { RefreshToken } from './refresh-token.entity';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['phoneNumber'], { unique: true })
@Index(['status'])
@Index(['userType'])
export class User extends SoftDeletableEntity {
  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    name:  'email_verified',
    type: 'boolean',
    default: false,
  })
  emailVerified: boolean;

  @Column({
    name: 'email_verified_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  emailVerifiedAt: Date | null;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 20,
    unique: true,
  })
  phoneNumber: string;

  @Column({
    name: 'phone_verified',
    type: 'boolean',
    default: false,
  })
  phoneVerified: boolean;

  @Column({
    name: 'phone_verified_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  phoneVerifiedAt: Date | null;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
  })
  passwordHash: string;

  @Column({
    name: 'password_changed_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  passwordChangedAt: Date | null;

  @Column({
    name: 'pin_hash',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  pinHash: string | null;

  @Column({
    name: 'user_type',
    type: 'enum',
    enum: UserType,
  })
  userType: UserType;

  @Column({
    name: 'status',
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  status: UserStatus;

  @Column({
    name: 'mfa_enabled',
    type: 'boolean',
    default: false,
  })
  mfaEnabled: boolean;

  @Column({
    name: 'mfa_method',
    type: 'enum',
    enum: MfaMethod,
    default:  MfaMethod.NONE,
  })
  mfaMethod: MfaMethod;

  @Column({
    name: 'mfa_secret',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  mfaSecret: string | null;

  @Column({
    name: 'failed_login_attempts',
    type: 'smallint',
    default: 0,
  })
  failedLoginAttempts: number;

  @Column({
    name:  'locked_until',
    type: 'timestamp with time zone',
    nullable:  true,
  })
  lockedUntil: Date | null;

  @Column({
    name: 'last_login_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  lastLoginAt: Date | null;

  @Column({
    name: 'last_login_ip',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  lastLoginIp: string | null;

  @Column({
    name: 'profile_id',
    type: 'uuid',
    nullable: true,
    comment: 'Reference to patient/provider profile based on user_type',
  })
  profileId: string | null;

  @Column({
    name: 'metadata',
    type: 'jsonb',
    nullable: true,
    default: {},
  })
  metadata: Record<string, unknown>;

  // Relationships
  @OneToMany(() => Session, session => session.user)
  sessions: Session[];

  @OneToMany(() => RefreshToken, token => token.user)
  refreshTokens: RefreshToken[];

  // Hooks
  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email. toLowerCase().trim();
    }
  }

  // Helper methods
  isLocked(): boolean {
    return this.lockedUntil !== null && this.lockedUntil > new Date();
  }

  isVerified(): boolean {
    return this.emailVerified || this.phoneVerified;
  }

  canLogin(): boolean {
    return (
      this.status === UserStatus.ACTIVE &&
      !this.isLocked() &&
      this.isVerified()
    );
  }
}
