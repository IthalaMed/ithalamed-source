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
 * Guardian relationship types
 */
export enum GuardianRelationship {
  PARENT = 'parent',
  LEGAL_GUARDIAN = 'legal_guardian',
  SPOUSE = 'spouse',
  CHILD = 'child',
  SIBLING = 'sibling',
  OTHER_FAMILY = 'other_family',
  CAREGIVER = 'caregiver',
  POWER_OF_ATTORNEY = 'power_of_attorney',
}

/**
 * Patient Guardian Entity
 * 
 * Manages guardian/dependent relationships for minors and elderly patients.
 * Implements FR-PAT-003 (Guardian/Dependent management).
 */
@Entity('patient_guardians')
@Index(['guardianPatientId', 'dependentPatientId'], { unique:  true })
@Index(['dependentPatientId'])
@Index(['isActive'])
export class PatientGuardian extends BaseEntity {
  /**
   * Guardian's patient ID
   */
  @Column({
    name: 'guardian_patient_id',
    type: 'uuid',
  })
  guardianPatientId:  string;

  /**
   * Dependent's patient ID
   */
  @Column({
    name: 'dependent_patient_id',
    type: 'uuid',
  })
  dependentPatientId: string;

  /**
   * Relationship type
   */
  @Column({
    name: 'relationship',
    type: 'enum',
    enum: GuardianRelationship,
  })
  relationship: GuardianRelationship;

  /**
   * Whether guardian can make medical decisions
   */
  @Column({
    name:  'can_make_medical_decisions',
    type: 'boolean',
    default: true,
  })
  canMakeMedicalDecisions: boolean;

  /**
   * Whether guardian can view medical records
   */
  @Column({
    name:  'can_view_medical_records',
    type: 'boolean',
    default: true,
  })
  canViewMedicalRecords: boolean;

  /**
   * Whether guardian can book appointments
   */
  @Column({
    name: 'can_book_appointments',
    type: 'boolean',
    default: true,
  })
  canBookAppointments: boolean;

  /**
   * Whether guardian can manage prescriptions
   */
  @Column({
    name: 'can_manage_prescriptions',
    type: 'boolean',
    default: true,
  })
  canManagePrescriptions:  boolean;

  /**
   * Whether guardian receives notifications
   */
  @Column({
    name:  'receives_notifications',
    type: 'boolean',
    default: true,
  })
  receivesNotifications: boolean;

  /**
   * Legal documentation reference
   */
  @Column({
    name: 'legal_document_id',
    type: 'uuid',
    nullable: true,
  })
  legalDocumentId: string | null;

  /**
   * Start date of guardianship
   */
  @Column({
    name: 'start_date',
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  startDate: Date;

  /**
   * End date of guardianship (null if ongoing)
   */
  @Column({
    name: 'end_date',
    type: 'date',
    nullable: true,
  })
  endDate: Date | null;

  /**
   * Reason for guardianship ending
   */
  @Column({
    name: 'end_reason',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  endReason: string | null;

  /**
   * Whether relationship is active
   */
  @Column({
    name: 'is_active',
    type:  'boolean',
    default:  true,
  })
  isActive: boolean;

  /**
   * Whether this is the primary guardian
   */
  @Column({
    name: 'is_primary',
    type: 'boolean',
    default: false,
  })
  isPrimary: boolean;

  /**
   * Verified by (staff user ID who verified the relationship)
   */
  @Column({
    name: 'verified_by',
    type: 'uuid',
    nullable: true,
  })
  verifiedBy: string | null;

  /**
   * Verification timestamp
   */
  @Column({
    name: 'verified_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  verifiedAt: Date | null;

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
  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guardian_patient_id' })
  guardian: Patient;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name:  'dependent_patient_id' })
  dependent: Patient;
}
