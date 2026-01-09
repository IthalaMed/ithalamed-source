import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../base/base. entity';
import { Patient } from './patient.entity';
import { ConsentType } from '@ithalamed/common';

/**
 * Patient Consent Entity
 * 
 * Tracks patient consents for POPIA/GDPR compliance.
 * Implements FR-PAT-007 for privacy consent management.
 */
@Entity('patient_consents')
@Index(['patientId', 'consentType'], { unique: true })
@Index(['consentType'])
@Index(['granted'])
export class PatientConsent extends BaseEntity {
  @Column({
    name: 'patient_id',
    type: 'uuid',
  })
  patientId: string;

  /**
   * Type of consent
   */
  @Column({
    name: 'consent_type',
    type:  'enum',
    enum:  ConsentType,
  })
  consentType: ConsentType;

  /**
   * Whether consent was granted
   */
  @Column({
    name: 'granted',
    type: 'boolean',
  })
  granted: boolean;

  /**
   * Version of the consent document
   */
  @Column({
    name: 'version',
    type: 'varchar',
    length: 20,
    default: '1.0',
  })
  version: string;

  /**
   * Date consent was granted
   */
  @Column({
    name: 'granted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  grantedAt: Date | null;

  /**
   * Date consent was revoked
   */
  @Column({
    name: 'revoked_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  revokedAt: Date | null;

  /**
   * IP address when consent was given/revoked
   */
  @Column({
    name: 'ip_address',
    type:  'varchar',
    length: 45,
    nullable: true,
  })
  ipAddress: string | null;

  /**
   * User agent when consent was given/revoked
   */
  @Column({
    name: 'user_agent',
    type: 'text',
    nullable: true,
  })
  userAgent: string | null;

  /**
   * Additional metadata
   */
  @Column({
    name: 'metadata',
    type: 'jsonb',
    default: {},
  })
  metadata: Record<string, unknown>;

  // Relationships
  @ManyToOne(() => Patient, patient => patient.consents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  // Helper methods
  isActive(): boolean {
    return this. granted && !this.revokedAt;
  }
}
