import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AuditableEntity } from '../base/base.entity';
import { Patient } from './patient.entity';
import { DocumentType } from '@ithalamed/common';

/**
 * Patient Document Entity
 * 
 * Stores references to patient documents (files stored in S3/cloud).
 */
@Entity('patient_documents')
@Index(['patientId'])
@Index(['documentType'])
@Index(['uploadedAt'])
export class PatientDocument extends AuditableEntity {
  @Column({
    name: 'patient_id',
    type: 'uuid',
  })
  patientId: string;

  /**
   * Document type
   */
  @Column({
    name: 'document_type',
    type:  'enum',
    enum:  DocumentType,
  })
  documentType: DocumentType;

  /**
   * Original file name
   */
  @Column({
    name: 'file_name',
    type:  'varchar',
    length:  255,
  })
  fileName: string;

  /**
   * Storage key/path (S3 key)
   */
  @Column({
    name: 'storage_key',
    type: 'varchar',
    length: 500,
  })
  storageKey: string;

  /**
   * File URL (pre-signed or public)
   */
  @Column({
    name: 'file_url',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  fileUrl: string | null;

  /**
   * MIME type
   */
  @Column({
    name: 'mime_type',
    type: 'varchar',
    length: 100,
  })
  mimeType: string;

  /**
   * File size in bytes
   */
  @Column({
    name: 'file_size',
    type: 'integer',
  })
  fileSize: number;

  /**
   * Document title/description
   */
  @Column({
    name: 'title',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  title: string | null;

  /**
   * Document description
   */
  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description: string | null;

  /**
   * Date document was uploaded
   */
  @Column({
    name: 'uploaded_at',
    type:  'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  uploadedAt: Date;

  /**
   * Date of the document (e.g., date of lab result)
   */
  @Column({
    name: 'document_date',
    type: 'date',
    nullable: true,
  })
  documentDate: Date | null;

  /**
   * Provider who uploaded/associated the document
   */
  @Column({
    name: 'uploaded_by_provider_id',
    type: 'uuid',
    nullable: true,
  })
  uploadedByProviderId: string | null;

  /**
   * Related encounter/appointment ID
   */
  @Column({
    name: 'encounter_id',
    type: 'uuid',
    nullable: true,
  })
  encounterId: string | null;

  /**
   * Whether document is verified by provider
   */
  @Column({
    name: 'is_verified',
    type: 'boolean',
    default: false,
  })
  isVerified: boolean;

  /**
   * OCR extracted text (for searchability)
   */
  @Column({
    name: 'ocr_text',
    type: 'text',
    nullable: true,
  })
  ocrText: string | null;

  /**
   * Tags for categorization
   */
  @Column({
    name: 'tags',
    type: 'text',
    array: true,
    default: [],
  })
  tags: string[];

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
  @ManyToOne(() => Patient, patient => patient. documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;
}
