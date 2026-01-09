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
 * Condition status
 */
export enum ConditionStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
  REMISSION = 'remission',
  INACTIVE = 'inactive',
}

/**
 * Patient Chronic Condition Entity
 * 
 * Records patient's chronic conditions and medical history.
 * Supports ICD-10 coding for standardization.
 */
@Entity('patient_conditions')
@Index(['patientId'])
@Index(['icd10Code'])
@Index(['status'])
@Index(['isChronc'])
export class PatientCondition extends AuditableEntity {
  @Column({
    name:  'patient_id',
    type: 'uuid',
  })
  patientId: string;

  /**
   * Condition name/description
   */
  @Column({
    name: 'condition_name',
    type: 'varchar',
    length: 500,
  })
  conditionName: string;

  /**
   * ICD-10 diagnosis code
   */
  @Column({
    name: 'icd10_code',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  icd10Code: string | null;

  /**
   * ICD-10 description
   */
  @Column({
    name: 'icd10_description',
    type:  'varchar',
    length: 500,
    nullable: true,
  })
  icd10Description:  string | null;

  /**
   * Status of the condition
   */
  @Column({
    name: 'status',
    type: 'enum',
    enum: ConditionStatus,
    default: ConditionStatus. ACTIVE,
  })
  status: ConditionStatus;

  /**
   * Whether this is a chronic condition
   */
  @Column({
    name: 'is_chronic',
    type: 'boolean',
    default: false,
  })
  isChronc: boolean;

  /**
   * Date when condition was diagnosed
   */
  @Column({
    name: 'diagnosed_date',
    type: 'date',
    nullable: true,
  })
  diagnosedDate: Date | null;

  /**
   * Date when condition was resolved (if applicable)
   */
  @Column({
    name: 'resolved_date',
    type: 'date',
    nullable: true,
  })
  resolvedDate: Date | null;

  /**
   * Severity (1-5, where 5 is most severe)
   */
  @Column({
    name: 'severity',
    type: 'smallint',
    nullable: true,
  })
  severity: number | null;

  /**
   * Clinical notes
   */
  @Column({
    name: 'notes',
    type: 'text',
    nullable: true,
  })
  notes: string | null;

  /**
   * Provider who diagnosed/recorded the condition
   */
  @Column({
    name: 'diagnosed_by_provider_id',
    type: 'uuid',
    nullable: true,
  })
  diagnosedByProviderId: string | null;

  // Relationships
  @ManyToOne(() => Patient, patient => patient.conditions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  // Helper methods
  isActiveCondition(): boolean {
    return this.status === ConditionStatus. ACTIVE;
  }
}
