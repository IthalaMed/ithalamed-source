import {
  Entity,
  Column,
  Index,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { AuditableEntity } from '../base/base.entity';
import { UserType, UserStatus, MfaMethod } from '@ithalamed/common';
import { Session } from './session.entity';
import { RefreshToken } from './refresh-token.entity';

/**
 * User Entity
 * 
 * Core authentication entity for all user types in the IthalaMed platform. 
 * Implements FR-PAT-001 (multi-method authentication), FR-PAT-002 (2FA),
 * and security requirements from ithalamed_overview.txt.
 */
@Entity('users')
@Index(['email'], { unique: true, where: '"email" IS NOT NULL' })
@Index(['phoneNumber'], { unique: true })
@Index(['userType'])
@Index(['status'])
@Index(['createdAt'])
export class User extends AuditableEntity {
  /**
   * Email address (unique, nullable for phone-only users)
   */
  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email: string | null;

  /**
   * Whether email is verified
   */
  @Column({
    name: 'email_verified',
    type:  'boolean',
    default:  false,
  })
  emailVerified: boolean;

  /**
   * Email verification timestamp
   */
  @Column({
    name: 'email_verified_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  emailVerifiedAt: Date | null;

  /**
   * Phone number in E.164 format (required)
   */
  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 20,
    unique: true,
  })
  phoneNumber: string;

  /**
   * Whether phone is verified
   */
  @Column({
    name: 'phone_verified',
    type: 'boolean',
    default: false,
  })
  phoneVerified: boolean;

  /**
   * Phone verification timestamp
   */
  @Column({
    name: 'phone_verified_at',
    type: 'timestamp with time zone',
    nullable:  true,
  })
  phoneVerifiedAt: Date | null;

  /**
   * Hashed password (bcrypt)
   */
  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
  })
  passwordHash: string;

  /**
   * User type/role
   */
  @Column({
    name: 'user_type',
    type: 'enum',
    enum: UserType,
  })
  userType: UserType;

  /**
   * Account status
   */
  @Column({
    name: 'status',
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  status: UserStatus;

  /**
   * First name
   */
  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 100,
  })
  firstName: string;

  /**
   * Last name
   */
  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 100,
  })
  lastName: string;

  /**
   * Display name
   */
  @Column({
    name: 'display_name',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  displayName: string | null;

  /**
   * Profile photo URL
   */
  @Column({
    name: 'profile_photo_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  profilePhotoUrl: string | null;

  /**
   * Preferred language (ISO 639-1 code)
   */
  @Column({
    name: 'preferred_language',
    type: 'varchar',
    length: 10,
    default: 'en',
  })
  preferredLanguage: string;

  /**
   * Timezone
   */
  @Column({
    name: 'timezone',
    type: 'varchar',
    length: 50,
    default: 'Africa/Johannesburg',
  })
  timezone: string;

  // ==================== MFA FIELDS ====================

  /**
   * Whether MFA is enabled
   */
  @Column({
    name:  'mfa_enabled',
    type: 'boolean',
    default: false,
  })
  mfaEnabled: boolean;

  /**
   * Preferred MFA method
   */
  @Column({
    name:  'mfa_method',
    type: 'enum',
    enum: MfaMethod,
    nullable: true,
  })
  mfaMethod: MfaMethod | null;

  /**
   * TOTP secret (encrypted)
   */
  @Column({
    name: 'totp_secret',
    type:  'varchar',
    length:  500,
    nullable: true,
  })
  totpSecret: string | null;

  /**
   * MFA backup codes (encrypted JSON array)
   */
  @Column({
    name: 'mfa_backup_codes',
    type: 'text',
    nullable: true,
  })
  mfaBackupCodes: string | null;

  // ==================== SECURITY FIELDS ====================

  /**
   * Number of failed login attempts
   */
  @Column({
    name:  'failed_login_attempts',
    type: 'smallint',
    default: 0,
  })
  failedLoginAttempts: number;

  /**
   * Account locked until timestamp
   */
  @Column({
    name: 'locked_until',
    type: 'timestamp with time zone',
    nullable: true,
  })
  lockedUntil: Date | null;

  /**
   * Last failed login attempt
   */
  @Column({
    name: 'last_failed_login_at',
    type: 'timestamp with time zone',
    nullable:  true,
  })
  lastFailedLoginAt: Date | null;

  /**
   * Last successful login
   */
  @Column({
    name: 'last_login_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  lastLoginAt: Date | null;

  /**
   * Last login IP address
   */
  @Column({
    name: 'last_login_ip',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  lastLoginIp: string | null;

  /**
   * Last password change
   */
  @Column({
    name: 'password_changed_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  passwordChangedAt: Date | null;

  /**
   * Password reset token (hashed)
   */
  @Column({
    name: 'password_reset_token',
    type: 'varchar',
    length: 255,
    nullable:  true,
  })
  passwordResetToken: string | null;

  /**
   * Password reset token expiry
   */
  @Column({
    name: 'password_reset_expires',
    type: 'timestamp with time zone',
    nullable:  true,
  })
  passwordResetExpires: Date | null;

  // ==================== BIOMETRIC FIELDS ====================

  /**
   * Whether biometric login is enabled
   */
  @Column({
    name: 'biometric_enabled',
    type: 'boolean',
    default: false,
  })
  biometricEnabled: boolean;

  /**
   * Biometric public key (for WebAuthn)
   */
  @Column({
    name:  'biometric_public_key',
    type: 'text',
    nullable: true,
  })
  biometricPublicKey: string | null;

  // ==================== PIN FIELDS ====================

  /**
   * PIN hash (for quick access)
   */
  @Column({
    name: 'pin_hash',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  pinHash: string | null;

  /**
   * PIN set timestamp
   */
  @Column({
    name: 'pin_set_at',
    type:  'timestamp with time zone',
    nullable: true,
  })
  pinSetAt: Date | null;

  // ==================== TERMS & CONSENT ====================

  /**
   * Terms of service accepted
   */
  @Column({
    name: 'terms_accepted',
    type: 'boolean',
    default: false,
  })
  termsAccepted: boolean;

  /**
   * Terms accepted timestamp
   */
  @Column({
    name: 'terms_accepted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  termsAcceptedAt: Date | null;

  /**
   * Privacy policy accepted
   */
  @Column({
    name: 'privacy_accepted',
    type: 'boolean',
    default: false,
  })
  privacyAccepted: boolean;

  /**
   * Privacy policy accepted timestamp
   */
  @Column({
    name: 'privacy_accepted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  privacyAcceptedAt: Date | null;

  // ==================== METADATA ====================

  /**
   * Additional metadata
   */
  @Column({
    name: 'metadata',
    type: 'jsonb',
    default: {},
  })
  metadata: Record<string, unknown>;

  // ==================== RELATIONSHIPS ====================

  /**
   * User sessions
   */
  @OneToMany(() => Session, session => session.user)
  sessions: Session[];

  /**
   * Refresh tokens
   */
  @OneToMany(() => RefreshToken, token => token.user)
  refreshTokens: RefreshToken[];

  // ==================== HOOKS ====================

  @BeforeInsert()
  @BeforeUpdate()
  normalizeData() {
    if (this.email) {
      this.email = this.email. toLowerCase().trim();
    }
    if (this.firstName) {
      this.firstName = this.firstName.trim();
    }
    if (this.lastName) {
      this.lastName = this.lastName.trim();
    }
    if (! this.displayName && this.firstName && this.lastName) {
      this.displayName = `${this.firstName} ${this.lastName}`;
    }
  }

  // ==================== HELPER METHODS ====================

  /**
   * Get full name
   */
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Check if account is locked
   */
  isLocked(): boolean {
    if (! this.lockedUntil) return false;
    return new Date() < this.lockedUntil;
  }

  /**
   * Check if account is active
   */
  isActive(): boolean {
    return this.status === UserStatus. ACTIVE && !this.isLocked();
  }

  /**
   * Check if account requires verification
   */
  requiresVerification(): boolean {
    return this.status === UserStatus. PENDING_VERIFICATION;
  }

  /**
   * Check if password reset is valid
   */
  isPasswordResetValid(): boolean {
    if (!this.passwordResetToken || !this.passwordResetExpires) {
      return false;
    }
    return new Date() < this.passwordResetExpires;
  }
}
