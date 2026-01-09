import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { Provider } from './provider.entity';

/**
 * Provider-Facility Association Entity
 * 
 * Links providers to facilities where they practice.
 */
@Entity('provider_facilities')
@Index(['providerId', 'facilityId'], { unique: true })
@Index(['facilityId'])
@Index(['isPrimary'])
export class ProviderFacility extends BaseEntity {
  @Column({
    name: 'provider_id',
    type: 'uuid',
  })
  providerId: string;

  @Column({
    name: 'facility_id',
    type: 'uuid',
  })
  facilityId: string;

  /**
   * Whether this is the provider's primary facility
   */
  @Column({
    name: 'is_primary',
    type: 'boolean',
    default: false,
  })
  isPrimary: boolean;

  /**
   * Provider's role at this facility
   */
  @Column({
    name: 'role',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  role: string | null;

  /**
   * Department within facility
   */
  @Column({
    name: 'department',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  department: string | null;

  /**
   * Room/Office number
   */
  @Column({
    name: 'room_number',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  roomNumber: string | null;

  /**
   * Direct phone at facility
   */
  @Column({
    name: 'facility_phone',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  facilityPhone: string | null;

  /**
   * Consultation fee at this facility (may differ)
   */
  @Column({
    name: 'consultation_fee',
    type: 'integer',
    nullable: true,
  })
  consultationFee: number | null;

  /**
   * Start date at facility
   */
  @Column({
    name: 'start_date',
    type: 'date',
    nullable: true,
  })
  startDate: Date | null;

  /**
   * End date at facility (if no longer practicing there)
   */
  @Column({
    name: 'end_date',
    type: 'date',
    nullable: true,
  })
  endDate: Date | null;

  /**
   * Is active
   */
  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  // Relationships
  @ManyToOne(() => Provider, provider => provider.providerFacilities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;
}
