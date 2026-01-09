import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AuditableEntity } from '../base/base.entity';
import { Patient } from './patient.entity';

/**
 * Allergy severity levels
 */
export enum AllergySeverity {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  LIFE_THREATENING = 'life_threatening',
}

/**
 * Allergy types
 */
export enum AllergyType {
  DRUG = 'drug',
  FOOD = 'food',
  ENVIRONMENTAL = 'environmental',
  OTHER = 'other',
}

/**
 * Patient Allergy Entity
 * 
 * Records patient allergies with severity and reaction details. 
 * Critical for prescription safety checks and clinical alerts.
 */
@Entity('patient_allergies')
@Index(['patientId'])
@Index(['allergen'])
@Index(['allergyType'])
@Index(['isActive'])
export class PatientAllergy extends AuditableEntity {
  @Column({
    name: 'patient_id',
    type: 'uuid',
  })
  patientId: string;

  /**
   * Name of the allergen
   */
  @Column({
    name: 'allergen',
    type: 'varchar',
    length: 255,
  })
  allergen: string;

  /**
   * Type of allergy
   */
  @Column({
    name: 'allergy_type',
    type:  'enum',
    enum:  AllergyType,
    default: AllergyType.OTHER,
  })
  allergyType: AllergyType;

  /**
   * Severity of allergic reaction
   */
  @Column({
    name: 'severity',
    type: 'enum',
    enum: AllergySeverity,
    default:  AllergySeverity.MODERATE,
  })
  severity: AllergySeverity;

  /**
   * Description of the allergic reaction
   */
  @Column({
    name: 'reaction',
    type: 'text',
    nullable: true,
  })
  reaction: string | null;

  /**
   * Date when allergy was first identified
   */
  @Column({
    name: 'onset_date',
    type: 'date',
    nullable: true,
  })
  onsetDate: Date | null;

  /**
   * Whether allergy is currently active
   */
  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  /**
   * Source of allergy information
   */
  @Column({
    name:  'source',
    type:  'varchar',
    length:  100,
    nullable: true,
  })
  source: string | null;

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
   * Provider who recorded the allergy
   */
  @Column({
    name: 'recorded_by_provider_id',
    type: 'uuid',
    nullable: true,
  })
  recordedByProviderId: string | null;

  // Relationships
  @ManyToOne(() => Patient, patient => patient. allergies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  // Helper methods
  isSevere(): boolean {
    return this.severity === AllergySeverity.SEVERE || 
           this.severity === AllergySeverity.LIFE_THREATENING;
  }
}
