import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../base/base. entity';
import { Patient } from './patient.entity';

/**
 * Patient Emergency Contact Entity
 * 
 * Stores emergency contacts for patients.
 * Minimum 2 contacts required per patient (FR-PAT-006).
 */
@Entity('patient_emergency_contacts')
@Index(['patientId'])
@Index(['priority'])
export class PatientEmergencyContact extends BaseEntity {
  @Column({
    name: 'patient_id',
    type: 'uuid',
  })
  patientId: string;

  /**
   * Contact's full name
   */
  @Column({
    name: 'name',
    type: 'varchar',
    length: 200,
  })
  name: string;

  /**
   * Relationship to patient
   */
  @Column({
    name: 'relationship',
    type: 'varchar',
    length: 100,
  })
  relationship: string;

  /**
   * Primary phone number (E.164 format)
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
   * Priority order (1 = primary contact)
   */
  @Column({
    name: 'priority',
    type: 'smallint',
    default: 1,
  })
  priority: number;

  /**
   * Whether this contact can make medical decisions
   */
  @Column({
    name: 'can_make_medical_decisions',
    type: 'boolean',
    default: false,
  })
  canMakeMedicalDecisions: boolean;

  /**
   * Whether this contact is active
   */
  @Column({
    name:  'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  /**
   * Additional notes
   */
  @Column({
    name: 'notes',
    type: 'text',
    nullable: true,
  })
  notes: string | null;

  // Relationships
  @ManyToOne(() => Patient, patient => patient.emergencyContacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name:  'patient_id' })
  patient: Patient;
}
