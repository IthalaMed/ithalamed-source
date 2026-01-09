import {
  Entity,
  Column,
  Index,
  OneToMany,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { AuditableEntity } from '../base/base.entity';
import {
  Gender,
  BloodType,
  PatientStatus,
  Address,
  MedicalAid,
  EmergencyContact,
} from '@ithalamed/common';
import { PatientConsent } from './patient-consent. entity';
import { PatientDocument } from './patient-document.entity';
import { PatientAllergy } from './patient-allergy.entity';
import { PatientCondition } from './patient-condition. entity';
import { PatientEmergencyContact } from './patient-emergency-contact.entity';

/**
 * Patient Entity
 * 
 * Core entity representing a patient in the IthalaMed system. 
 * Implements FR-PAT-001 through FR-PAT-009 from the FRD. 
 * 
 * Features:
 * - Unique patient number generation
 * - South African ID number validation and storage (encrypted)
 * - Medical aid integration
 * - Emergency contact management (minimum 2 required)
 * - Guardian/Dependent relationships
 * - Consent management
 */
@Entity('patients')
@Index(['patientNumber'], { unique: true })
@Index(['idNumber'], { unique: true })
@Index(['userId'], { unique:  true, where: '"user_id" IS NOT NULL' })
@Index(['status'])
@Index(['lastName', 'firstName'])
@Index(['phoneNumber'])
@Index(['email'], { where: '"email" IS NOT NULL' })
export class Patient extends AuditableEntity {
  /**
   * System-generated unique patient number
   * Format: PT{YEAR}{SEQUENCE} e.g., PT2024000001
   */
  @Column({
    name: 'patient_number',
    type: 'varchar',
    length: 20,
    unique: true,
  })
  patientNumber: string;

  /**
   * Reference to user account for app access
   * Nullable for patients registered by providers without app access
   */
  @Column({
    name: 'user_id',
    type:  'uuid',
    nullable:  true,
  })
  userId: string | null;

  /**
   * Patient's first/given name
   */
  @Column({
    name: 'first_name',
    type:  'varchar',
    length:  100,
  })
  firstName: string;

  /**
   * Patient's middle name(s)
   */
  @Column({
    name: 'middle_name',
    type:  'varchar',
    length:  100,
    nullable: true,
  })
  middleName: string | null;

  /**
   * Patient's last/family name
   */
  @Column({
    name: 'last_name',
    type:  'varchar',
    length:  100,
  })
  lastName: string;

  /**
   * Encrypted South African ID number or passport number
   * Encrypted using AES-256 at application level
   */
  @Column({
    name: 'id_number',
    type: 'varchar',
    length: 500,
    unique: true,
  })
  idNumber: string;

  /**
   * Type of identification document
   */
  @Column({
    name: 'id_type',
    type: 'varchar',
    length: 20,
    default: 'sa_id',
  })
  idType: 'sa_id' | 'passport' | 'other';

  /**
   * Patient's date of birth
   */
  @Column({
    name:  'date_of_birth',
    type: 'date',
  })
  dateOfBirth: Date;

  /**
   * Patient's gender
   */
  @Column({
    name: 'gender',
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  /**
   * Patient's blood type (if known)
   */
  @Column({
    name: 'blood_type',
    type:  'enum',
    enum:  BloodType,
    nullable:  true,
  })
  bloodType: BloodType | null;

  /**
   * Primary contact phone number (E.164 format)
   */
  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 20,
  })
  phoneNumber: string;

  /**
   * Alternative phone number
   */
  @Column({
    name: 'alternative_phone',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  alternativePhone: string | null;

  /**
   * Email address
   */
  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email: string | null;

  /**
   * Physical address stored as JSONB
   */
  @Column({
    name: 'address',
    type: 'jsonb',
    nullable: true,
  })
  address: Address | null;

  /**
   * Medical aid/insurance information
   */
  @Column({
    name: 'medical_aid',
    type: 'jsonb',
    nullable:  true,
  })
  medicalAid: MedicalAid | null;

  /**
   * Whether medical aid has been verified
   */
  @Column({
    name: 'medical_aid_verified',
    type: 'boolean',
    default: false,
  })
  medicalAidVerified: boolean;

  /**
   * Date of medical aid verification
   */
  @Column({
    name: 'medical_aid_verified_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  medicalAidVerifiedAt: Date | null;

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
   * Patient status
   */
  @Column({
    name: 'status',
    type: 'enum',
    enum: PatientStatus,
    default: PatientStatus. ACTIVE,
  })
  status: PatientStatus;

  /**
   * Whether patient is a minor (under 18)
   */
  @Column({
    name:  'is_minor',
    type: 'boolean',
    default: false,
  })
  isMinor: boolean;

  /**
   * Guardian's patient ID (for minors)
   */
  @Column({
    name: 'guardian_patient_id',
    type: 'uuid',
    nullable: true,
  })
  guardianPatientId: string | null;

  /**
   * Date of last visit/encounter
   */
  @Column({
    name: 'last_visit_at',
    type: 'timestamp with time zone',
    nullable:  true,
  })
  lastVisitAt: Date | null;

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
   * Patient's allergies
   */
  @OneToMany(() => PatientAllergy, allergy => allergy.patient, {
    cascade: ['insert', 'update'],
  })
  allergies: PatientAllergy[];

  /**
   * Patient's chronic conditions
   */
  @OneToMany(() => PatientCondition, condition => condition.patient, {
    cascade: ['insert', 'update'],
  })
  conditions: PatientCondition[];

  /**
   * Emergency contacts (minimum 2 required)
   */
  @OneToMany(() => PatientEmergencyContact, contact => contact.patient, {
    cascade: ['insert', 'update'],
  })
  emergencyContacts: PatientEmergencyContact[];

  /**
   * Patient consents
   */
  @OneToMany(() => PatientConsent, consent => consent.patient, {
    cascade: ['insert', 'update'],
  })
  consents: PatientConsent[];

  /**
   * Patient documents
   */
  @OneToMany(() => PatientDocument, document => document.patient)
  documents: PatientDocument[];

  // ==================== HOOKS ====================

  @BeforeInsert()
  @BeforeUpdate()
  normalizeData() {
    // Normalize email to lowercase
    if (this.email) {
      this.email = this.email. toLowerCase().trim();
    }

    // Normalize names to title case
    if (this.firstName) {
      this.firstName = this.firstName.trim();
    }
    if (this.lastName) {
      this.lastName = this.lastName.trim();
    }

    // Update isMinor based on date of birth
    if (this.dateOfBirth) {
      const today = new Date();
      const age = today.getFullYear() - new Date(this.dateOfBirth).getFullYear();
      this.isMinor = age < 18;
    }
  }

  // ==================== HELPER METHODS ====================

  /**
   * Get full name
   */
  getFullName(): string {
    const parts = [this.firstName];
    if (this.middleName) {
      parts.push(this. middleName);
    }
    parts.push(this.lastName);
    return parts.join(' ');
  }

  /**
   * Get formatted name (Last, First Middle)
   */
  getFormattedName(): string {
    let name = `${this.lastName}, ${this. firstName}`;
    if (this.middleName) {
      name += ` ${this.middleName}`;
    }
    return name;
  }

  /**
   * Calculate current age
   */
  getAge(): number {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today. getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * Check if patient is active
   */
  isActive(): boolean {
    return this.status === PatientStatus.ACTIVE;
  }

  /**
   * Check if patient has valid medical aid
   */
  hasMedicalAid(): boolean {
    return this.medicalAid !== null && this.medicalAidVerified;
  }
}
