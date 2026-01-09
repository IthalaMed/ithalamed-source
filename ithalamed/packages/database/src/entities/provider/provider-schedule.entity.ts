import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../base/base. entity';
import { Provider } from './provider.entity';

/**
 * Day of week enum
 */
export enum DayOfWeek {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 0,
}

/**
 * Provider Schedule Entity
 * 
 * Defines working hours and availability for providers. 
 * Supports multiple facilities and different schedules per day.
 */
@Entity('provider_schedules')
@Index(['providerId'])
@Index(['facilityId'])
@Index(['dayOfWeek'])
@Index(['isActive'])
export class ProviderSchedule extends BaseEntity {
  @Column({
    name: 'provider_id',
    type:  'uuid',
  })
  providerId: string;

  /**
   * Facility ID (if schedule is facility-specific)
   */
  @Column({
    name: 'facility_id',
    type: 'uuid',
    nullable: true,
  })
  facilityId: string | null;

  /**
   * Day of week (0 = Sunday, 1 = Monday, etc.)
   */
  @Column({
    name: 'day_of_week',
    type: 'smallint',
  })
  dayOfWeek: DayOfWeek;

  /**
   * Start time (HH:MM format)
   */
  @Column({
    name: 'start_time',
    type: 'time',
  })
  startTime: string;

  /**
   * End time (HH: MM format)
   */
  @Column({
    name: 'end_time',
    type: 'time',
  })
  endTime: string;

  /**
   * Break start time
   */
  @Column({
    name: 'break_start',
    type: 'time',
    nullable: true,
  })
  breakStart: string | null;

  /**
   * Break end time
   */
  @Column({
    name: 'break_end',
    type: 'time',
    nullable: true,
  })
  breakEnd: string | null;

  /**
   * Slot duration for this schedule (minutes)
   */
  @Column({
    name: 'slot_duration',
    type: 'smallint',
    default: 30,
  })
  slotDuration: number;

  /**
   * Buffer time between appointments (minutes)
   */
  @Column({
    name: 'buffer_time',
    type: 'smallint',
    default: 5,
  })
  bufferTime: number;

  /**
   * Maximum appointments per slot (for overbooking)
   */
  @Column({
    name:  'max_appointments_per_slot',
    type:  'smallint',
    default: 1,
  })
  maxAppointmentsPerSlot: number;

  /**
   * Appointment types allowed during this schedule
   */
  @Column({
    name: 'allowed_appointment_types',
    type: 'text',
    array: true,
    default: [],
  })
  allowedAppointmentTypes: string[];

  /**
   * Whether this schedule allows telemedicine
   */
  @Column({
    name: 'allows_telemedicine',
    type: 'boolean',
    default: false,
  })
  allowsTelemedicine: boolean;

  /**
   * Whether this schedule allows walk-ins
   */
  @Column({
    name: 'allows_walk_ins',
    type:  'boolean',
    default:  false,
  })
  allowsWalkIns: boolean;

  /**
   * Effective from date
   */
  @Column({
    name: 'effective_from',
    type: 'date',
    nullable: true,
  })
  effectiveFrom: Date | null;

  /**
   * Effective until date
   */
  @Column({
    name: 'effective_until',
    type: 'date',
    nullable: true,
  })
  effectiveUntil: Date | null;

  /**
   * Is schedule active
   */
  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

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
  @ManyToOne(() => Provider, provider => provider. schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;
}
