import {
  Entity,
  Column,
  Index,
  OneToMany,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { AuditableEntity } from '../base/base.entity';
import {
  Gender,
  MedicalSpecialty,
  ProviderStatus,
  Qualification,
} from '@ithalamed/common';
import { ProviderSchedule } from './provider-schedule. entity';
import { ProviderFacility } from './provider-facility.entity';

/**
 * Healthcare Provider Entity
 * 
 * Represents doctors, nurses, specialists, and other healthcare professionals. 
 * Based on Provider Service requirements from ithalamed_overview. txt
 * and Healthcare Provider App from ithalamed_overview2.txt
 */
@Entity('providers')
@Index(['providerNumber'], { unique: true })
@Index(['userId'], { unique: true, where: '"user_id" IS NOT NULL' })
@Index(['hpcsaNumber'], { unique: true, where: '"hpcsa_number" IS NOT NULL' })
@Index(['specialty'])
@Index(['providerType'])
@Index(['status'])
@Index(['lastName', 'firstName'])
export class Provider extends AuditableEntity {
  /**
   * System-generated provider number
   * Format: PRV{YEAR}{SEQUENCE} e.g., PRV2024000001
   */
  @Column({
    name: 'provider_number',
    type: 'varchar',
    length: 20,
    unique: true,
  })
  providerNumber: string;

  /**
   * Reference to user account
   */
  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: true,
  })
  userId: string | null;

  /**
   * Provider's title (Dr., Prof., Mr., Mrs., etc.)
   */
  @Column({
    name: 'title',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  title: string | null;

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
   * Provider type (doctor, nurse, specialist, pharmacist, etc.)
   */
  @Column({
    name:  'provider_type',
    type: 'varchar',
    length: 50,
  })
  providerType: string;

  /**
   * Primary medical specialty
   */
  @Column({
    name: 'specialty',
    type: 'enum',
    enum: MedicalSpecialty,
    nullable:  true,
  })
  specialty: MedicalSpecialty | null;

  /**
   * Additional specialties
   */
  @Column({
    name: 'sub_specialties',
    type: 'text',
    array: true,
    default: [],
  })
  subSpecialties: string[];

  /**
   * HPCSA Registration Number (Health Professions Council of South Africa)
   */
  @Column({
    name: 'hpcsa_number',
    type: 'varchar',
    length: 20,
    unique: true,
    nullable: true,
  })
  hpcsaNumber: string | null;

  /**
   * HPCSA registration verified
   */
  @Column({
    name: 'hpcsa_verified',
    type:  'boolean',
    default:  false,
  })
  hpcsaVerified: boolean;

  /**
   * HPCSA verification date
   */
  @Column({
    name: 'hpcsa_verified_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  hpcsaVerifiedAt: Date | null;

  /**
   * Practice number
   */
  @Column({
    name: 'practice_number',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  practiceNumber: string | null;

  /**
   * Gender
   */
  @Column({
    name: 'gender',
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender | null;

  /**
   * Date of birth
   */
  @Column({
    name: 'date_of_birth',
    type: 'date',
    nullable: true,
  })
  dateOfBirth: Date | null;

  /**
   * Phone number
   */
  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 20,
  })
  phoneNumber: string;

  /**
   * Email address
   */
  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
  })
  email: string;

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
   * Professional biography
   */
  @Column({
    name: 'bio',
    type: 'text',
    nullable: true,
  })
  bio: string | null;

  /**
   * Qualifications and certifications
   */
  @Column({
    name: 'qualifications',
    type: 'jsonb',
    default: [],
  })
  qualifications: Qualification[];

  /**
   * Languages spoken
   */
  @Column({
    name: 'languages',
    type: 'text',
    array: true,
    default: ['en'],
  })
  languages: string[];

  /**
   * Years of experience
   */
  @Column({
    name: 'years_of_experience',
    type: 'smallint',
    nullable: true,
  })
  yearsOfExperience: number | null;

  /**
   * Standard consultation fee (in cents)
   */
  @Column({
    name: 'consultation_fee',
    type: 'integer',
    nullable: true,
  })
  consultationFee: number | null;

  /**
   * Currency for fees
   */
  @Column({
    name: 'fee_currency',
    type: 'varchar',
    length: 3,
    default: 'ZAR',
  })
  feeCurrency: string;

  /**
   * Whether provider accepts medical aid
   */
  @Column({
    name: 'accepts_medical_aid',
    type: 'boolean',
    default: true,
  })
  acceptsMedicalAid: boolean;

  /**
   * Medical aid schemes accepted
   */
  @Column({
    name: 'accepted_medical_aids',
    type: 'text',
    array: true,
    default: [],
  })
  acceptedMedicalAids: string[];

  /**
   * Whether provider offers telemedicine
   */
  @Column({
    name: 'offers_telemedicine',
    type: 'boolean',
    default: false,
  })
  offersTelemedicine:  boolean;

  /**
   * Telemedicine consultation fee (in cents)
   */
  @Column({
    name: 'telemedicine_fee',
    type: 'integer',
    nullable: true,
  })
  telemedicineFee: number | null;

  /**
   * Default appointment duration (minutes)
   */
  @Column({
    name: 'default_appointment_duration',
    type: 'smallint',
    default: 30,
  })
  defaultAppointmentDuration: number;

  /**
   * Average rating (1-5)
   */
  @Column({
    name: 'average_rating',
    type: 'decimal',
    precision: 2,
    scale: 1,
    nullable: true,
  })
  averageRating: number | null;

  /**
   * Total number of ratings
   */
  @Column({
    name: 'total_ratings',
    type: 'integer',
    default: 0,
  })
  totalRatings: number;

  /**
   * Provider status
   */
  @Column({
    name: 'status',
    type: 'varchar',
    length: 20,
    default: 'active',
  })
  status: string;

  /**
   * Digital signature (base64 encoded)
   */
  @Column({
    name:  'digital_signature',
    type: 'text',
    nullable: true,
  })
  digitalSignature: string | null;

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
   * Provider schedules
   */
  @OneToMany(() => ProviderSchedule, schedule => schedule.provider, {
    cascade: ['insert', 'update'],
  })
  schedules: ProviderSchedule[];

  /**
   * Provider-facility associations
   */
  @OneToMany(() => ProviderFacility, pf => pf.provider, {
    cascade: ['insert', 'update'],
  })
  providerFacilities: ProviderFacility[];

  // ==================== HOOKS ====================

  @BeforeInsert()
  @BeforeUpdate()
  normalizeData() {
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
   * Get full name with title
   */
  getFullName(): string {
    const parts = [];
    if (this.title) {
      parts.push(this. title);
    }
    parts.push(this.firstName);
    if (this.middleName) {
      parts.push(this.middleName);
    }
    parts.push(this.lastName);
    return parts.join(' ');
  }

  /**
   * Get display name (Dr.  First Last)
   */
  getDisplayName(): string {
    return this.title 
      ? `${this.title} ${this.firstName} ${this.lastName}`
      : `${this.firstName} ${this. lastName}`;
  }

  /**
   * Check if provider is available for telemedicine
   */
  canDoTelemedicine(): boolean {
    return this.offersTelemedicine && this.status === 'active';
  }

  /**
   * Check if provider accepts specific medical aid
   */
  acceptsMedicalAidScheme(scheme: string): boolean {
    if (!this.acceptsMedicalAid) return false;
    if (this.acceptedMedicalAids.length === 0) return true; // Accepts all
    return this.acceptedMedicalAids.includes(scheme);
  }
}
