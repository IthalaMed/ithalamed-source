import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { Patient } from './patient.entity';

/**
 * Medical Aid Member Type
 */
export enum MedicalAidMemberType {
  MAIN_MEMBER = 'main_member',
  SPOUSE = 'spouse',
  ADULT_DEPENDENT = 'adult_dependent',
  CHILD_DEPENDENT = 'child_dependent',
}

/**
 * Medical Aid Verification Status
 */
export enum MedicalAidVerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

/**
 * Patient Medical Aid Entity
 * 
 * Stores patient's medical aid/insurance information.
 * Implements FR-PAT-005 (Medical aid membership verification).
 */
@Entity('patient_medical_aids')
@Index(['patientId'])
@Index(['membershipNumber'])
@Index(['schemeCode'])
@Index(['isPrimary'])
@Index(['isActive'])
export class PatientMedicalAid extends BaseEntity {
  /**
   * Patient ID
   */
  @Column({
    name: 'patient_id',
    type: 'uuid',
  })
  patientId: string;

  /**
   * Medical aid scheme code
   */
  @Column({
    name: 'scheme_code',
    type: 'varchar',
    length: 50,
  })
  schemeCode: string;

  /**
   * Medical aid scheme name
   */
  @Column({
    name: 'scheme_name',
    type: 'varchar',
    length: 255,
  })
  schemeName: string;

  /**
   * Plan/Option name
   */
  @Column({
    name: 'plan_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  planName: string | null;

  /**
   * Membership number
   */
  @Column({
    name: 'membership_number',
    type: 'varchar',
    length: 50,
  })
  membershipNumber: string;

  /**
   * Dependent code (00 for main member)
   */
  @Column({
    name: 'dependent_code',
    type:  'varchar',
    length:  10,
    default: '00',
  })
  dependentCode: string;

  /**
   * Member type
   */
  @Column({
    name: 'member_type',
    type: 'enum',
    enum: MedicalAidMemberType,
    default: MedicalAidMemberType.MAIN_MEMBER,
  })
  memberType: MedicalAidMemberType;

  /**
   * Main member name (if this patient is a dependent)
   */
  @Column({
    name: 'main_member_name',
    type: 'varchar',
    length: 255,
    nullable:  true,
  })
  mainMemberName: string | null;

  /**
   * Main member ID number
   */
  @Column({
    name: 'main_member_id_number',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  mainMemberIdNumber: string | null;

  /**
   * Effective date
   */
  @Column({
    name: 'effective_date',
    type: 'date',
    nullable: true,
  })
  effectiveDate: Date | null;

  /**
   * Expiry date
   */
  @Column({
    name: 'expiry_date',
    type:  'date',
    nullable:  true,
  })
  expiryDate: Date | null;

  /**
   * Verification status
   */
  @Column({
    name: 'verification_status',
    type: 'enum',
    enum: MedicalAidVerificationStatus,
    default: MedicalAidVerificationStatus.PENDING,
  })
  verificationStatus: MedicalAidVerificationStatus;

  /**
   * Last verification date
   */
  @Column({
    name: 'last_verified_at',
    type: 'timestamp with time zone',
    nullable:  true,
  })
  lastVerifiedAt: Date | null;

  /**
   * Verification response (from medical aid API)
   */
  @Column({
    name: 'verification_response',
    type: 'jsonb',
    nullable: true,
  })
  verificationResponse: Record<string, unknown> | null;

  /**
   * Whether this is the primary medical aid
   */
  @Column({
    name: 'is_primary',
    type: 'boolean',
    default: true,
  })
  isPrimary: boolean;

  /**
   * Whether this medical aid is active
   */
  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  /**
   * Medical aid card image URL (front)
   */
  @Column({
    name: 'card_image_front_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  cardImageFrontUrl: string | null;

  /**
   * Medical aid card image URL (back)
   */
  @Column({
    name:  'card_image_back_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  cardImageBackUrl: string | null;

  /**
   * Notes
   */
  @Column({
    name: 'notes',
    type: 'text',
    nullable: true,
  })
  notes: string | null;

  // Relationships
  @ManyToOne(() => Patient, patient => patient.medicalAids, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  // Helper methods
  isVerified(): boolean {
    return this.verificationStatus === MedicalAidVerificationStatus.VERIFIED;
  }

  isExpired(): boolean {
    if (!this.expiryDate) return false;
    return new Date() > this.expiryDate;
  }
}
