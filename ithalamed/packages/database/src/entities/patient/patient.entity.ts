import {
  Entity,
  Column,
  Index,
  OneToMany,
  OneToOne,
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
} from '@ithalamed/common';
import { User } from '../auth/user.entity';
import { PatientConsent } from './patient-consent. entity';
import { PatientDocument } from './patient-document.entity';
import { PatientMedicalAid } from './patient-medical-aid.entity';
import { PatientEmergencyContact } from './patient-emergency-contact.entity';
import { PatientAllergy } from './patient-allergy.entity';
import { PatientChronicCondition } from './patient-condition';

/**
 * Patient Entity
 * 
 * Core patient demographics and profile information.
 * Implements FR-PAT-001 through FR-PAT-010 requirements.
 */
@Entity('patients')
@Index(['patientNumber'], { unique: true })
@Index(['idNumber'], { unique: true })
@Index(['userId'], { unique: true, where: '"user_id" IS NOT NULL' })
@Index(['status'])
@Index(['lastName', 'firstName'])
@Index(['phoneNumber'])
@Index(['email'])
@Index(['dateOfBirth'])
export class Patient extends AuditableEntity {
  /**
   * System-generated patient number
   * Format: PT{YEAR}{SEQUENCE} e.g., PT2024000001
   */
  @Column({
    name: 'patient_number',
    type:  'varchar',
    length:  20,
    unique: true,
  })
  patientNumber: string;

  /**
   * Reference to user account (nullable for patients without app access)
   */
  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: true,
  })
  userId: string | null;

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
   * Middle name
   */
  @Column({
    name: 'middle_name',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  middleName: string | null;

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
   * ID number (encrypted) - SA ID or Passport
   */
  @Column({
    name: 'id_number',
    type: 'varchar',
    length: 500,
    unique: true,
  })
  idNumber: string;

  /**
   * ID type
   */
  @Column({
    name: 'id_type',
    type: 'varchar',
    length: 20,
    default: 'sa_id',
  })
  idType: 'sa_id' | 'passport' | 'other';

  /**
   * Country of ID issue (for passports)
   */
  @Column({
    name: 'id_country',
    type:  'varchar',
    length:  2,
    default: 'ZA',
  })
  idCountry: string;

  /**
   * Date of birth
   */
  @Column({
    name: 'date_of_birth',
    type: 'date',
  })
  dateOfBirth: Date;

  /**
   * Gender
   */
  @Column({
    name: 'gender',
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  /**
   * Blood type
   */
  @Column({
    name: 'blood_type',
    type: 'enum',
    enum: BloodType,
    nullable: true,
  })
  bloodType: BloodType | null;

  /**
   * Phone number (E.164 format)
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
   * Physical address
   */
  @Column({
    name: 'address',
    type: 'jsonb',
    nullable: true,
  })
  address: Address | null;

  /**
   * Preferred language (ISO 639-1)
   */
  @Column({
    name: 'preferred_language',
    type: 'varchar',
    length: 10,
    default: 'en',
  })
  preferredLanguage: string;

  /**
   * Nationality (ISO 3166-1 alpha-2)
   */
  @Column({
    name: 'nationality',
    type: 'varchar',
    length: 2,
    default: 'ZA',
  })
  nationality: string;

  /**
   * Ethnicity (optional, for demographic purposes)
   */
  @Column({
    name: 'ethnicity',
    type:  'varchar',
    length:  100,
    nullable: true,
  })
  ethnicity: string | null;

  /**
   * Religion (optional, for dietary/cultural considerations)
   */
  @Column({
    name: 'religion',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  religion: string | null;

  /**
   * Occupation
   */
  @Column({
    name: 'occupation',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  occupation: string | null;

  /**
   * Employer name
   */
  @Column({
    name: 'employer',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  employer: string | null;

  /**
   * Marital status
   */
  @Column({
    name: 'marital_status',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' | 'separated' | 'domestic_partnership' | null;

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
   * Patient status
   */
  @Column({
    name: 'status',
    type: 'enum',
    enum: PatientStatus,
    default: PatientStatus.ACTIVE,
  })
  status: PatientStatus;

  /**
   * Deceased date (if applicable)
   */
  @Column({
    name: 'deceased_date',
    type: 'date',
    nullable: true,
  })
  deceasedDate: Date | null;

  /**
   * Is minor (under 18)
   */
  @Column({
    name:  'is_minor',
    type: 'boolean',
    default: false,
  })
  isMinor: boolean;

  /**
   * Requires guardian (for minors or incapacitated adults)
   */
  @Column({
    name: 'requires_guardian',
    type: 'boolean',
    default: false,
  })
  requiresGuardian: boolean;

  /**
   * Additional notes
   */
  @Column({
    name: 'notes',
    type: 'text',
    nullable: true,
  })
  notes: string | null;

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
   * User account (if registered)
   */
  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  /**
   * Patient consents
   */
  @OneToMany(() => PatientConsent, consent => consent.patient)
  consents: PatientConsent[];

  /**
   * Patient documents
   */
  @OneToMany(() => PatientDocument, document => document.patient)
  documents: PatientDocument[];

  /**
   * Medical aid memberships
   */
  @OneToMany(() => PatientMedicalAid, medicalAid => medicalAid.patient)
  medicalAids: PatientMedicalAid[];

  /**
   * Emergency contacts
   */
  @OneToMany(() => PatientEmergencyContact, contact => contact.patient)
  emergencyContacts: PatientEmergencyContact[];

  /**
   * Allergies
   */
  @OneToMany(() => PatientAllergy, allergy => allergy.patient)
  allergies: PatientAllergy[];

  /**
   * Chronic conditions
   */
  @OneToMany(() => PatientChronicCondition, condition => condition.patient)
  chronicConditions: PatientChronicCondition[];

  // ==================== HOOKS ====================

  @BeforeInsert()
  @BeforeUpdate()
  updateDerivedFields() {
    // Calculate if patient is a minor
    if (this.dateOfBirth) {
      const age = this.calculateAge();
      this.isMinor = age < 18;
      this.requiresGuardian = age < 18;
    }

    // Normalize data
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
    if (this.firstName) {
      this.firstName = this.firstName.trim();
    }
    if (this.lastName) {
      this.lastName = this.lastName.trim();
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
   * Calculate age in years
   */
  calculateAge(): number {
    if (!this.dateOfBirth) return 0;
    
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Check if patient is a minor
   */
  checkIsMinor(): boolean {
    return this.calculateAge() < 18;
  }

  /**
   * Check if patient is active
   */
  isActive(): boolean {
    return this.status === PatientStatus. ACTIVE;
  }

  /**
   * Check if patient is deceased
   */
  isDeceased(): boolean {
    return this.status === PatientStatus.DECEASED || this.deceasedDate !== null;
  }
}
