import {
  Entity,
  Column,
  Index,
  OneToMany,
} from 'typeorm';
import { AuditableEntity } from '../base/base.entity';
import { FacilityType, FacilityStatus, Address } from '@ithalamed/common';

/**
 * Operating hours for a single day
 */
export interface DailyOperatingHours {
  isOpen: boolean;
  openTime?:  string;
  closeTime?: string;
  breakStart?: string;
  breakEnd?: string;
}

/**
 * Weekly operating hours
 */
export interface OperatingHours {
  monday: DailyOperatingHours;
  tuesday: DailyOperatingHours;
  wednesday: DailyOperatingHours;
  thursday: DailyOperatingHours;
  friday: DailyOperatingHours;
  saturday: DailyOperatingHours;
  sunday: DailyOperatingHours;
  holidays?: DailyOperatingHours;
  notes?: string;
}

/**
 * Facility accreditation
 */
export interface FacilityAccreditation {
  name: string;
  issuingBody: string;
  certificateNumber?: string;
  issueDate: Date;
  expiryDate?:  Date;
  status: 'valid' | 'expired' | 'pending';
}

/**
 * Healthcare Facility Entity
 * 
 * Represents hospitals, clinics, pharmacies, laboratories, etc.
 * Based on Facility requirements from ithalamed_overview.txt
 */
@Entity('facilities')
@Index(['facilityNumber'], { unique: true })
@Index(['facilityType'])
@Index(['status'])
@Index(['name'])
@Index(['city'])
@Index(['province'])
export class Facility extends AuditableEntity {
  /**
   * System-generated facility number
   * Format: FAC{YEAR}{SEQUENCE} e.g., FAC2024000001
   */
  @Column({
    name: 'facility_number',
    type: 'varchar',
    length: 20,
    unique: true,
  })
  facilityNumber: string;

  /**
   * Facility name
   */
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  name: string;

  /**
   * Trading name (if different)
   */
  @Column({
    name: 'trading_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  tradingName: string | null;

  /**
   * Facility type
   */
  @Column({
    name: 'facility_type',
    type:  'enum',
    enum:  FacilityType,
  })
  facilityType: FacilityType;

  /**
   * Facility description
   */
  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description: string | null;

  /**
   * Physical address
   */
  @Column({
    name: 'address',
    type: 'jsonb',
  })
  address: Address;

  /**
   * GPS Latitude
   */
  @Column({
    name: 'latitude',
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  latitude: number | null;

  /**
   * GPS Longitude
   */
  @Column({
    name: 'longitude',
    type: 'decimal',
    precision: 11,
    scale: 8,
    nullable: true,
  })
  longitude: number | null;

  /**
   * City
   */
  @Column({
    name: 'city',
    type: 'varchar',
    length: 100,
  })
  city: string;

  /**
   * Province/State
   */
  @Column({
    name: 'province',
    type: 'varchar',
    length: 100,
  })
  province: string;

  /**
   * Country code (ISO 3166-1 alpha-2)
   */
  @Column({
    name: 'country_code',
    type: 'varchar',
    length: 2,
    default: 'ZA',
  })
  countryCode: string;

  /**
   * Main phone number
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
   * Emergency phone number
   */
  @Column({
    name: 'emergency_phone',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  emergencyPhone: string | null;

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
   * Website URL
   */
  @Column({
    name: 'website',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  website: string | null;

  /**
   * Operating hours
   */
  @Column({
    name: 'operating_hours',
    type: 'jsonb',
    nullable: true,
  })
  operatingHours: OperatingHours | null;

  /**
   * Is 24/7 facility
   */
  @Column({
    name: 'is_24_hours',
    type: 'boolean',
    default: false,
  })
  is24Hours: boolean;

  /**
   * Services offered
   */
  @Column({
    name: 'services',
    type: 'text',
    array: true,
    default: [],
  })
  services: string[];

  /**
   * Specialties available
   */
  @Column({
    name: 'specialties',
    type: 'text',
    array: true,
    default: [],
  })
  specialties: string[];

  /**
   * Accreditations and certifications
   */
  @Column({
    name: 'accreditations',
    type:  'jsonb',
    default: [],
  })
  accreditations: FacilityAccreditation[];

  /**
   * License number
   */
  @Column({
    name: 'license_number',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  licenseNumber: string | null;

  /**
   * License expiry date
   */
  @Column({
    name: 'license_expiry',
    type: 'date',
    nullable: true,
  })
  licenseExpiry: Date | null;

  /**
   * Number of beds (for hospitals)
   */
  @Column({
    name: 'bed_count',
    type: 'integer',
    nullable: true,
  })
  bedCount: number | null;

  /**
   * Has emergency department
   */
  @Column({
    name: 'has_emergency',
    type: 'boolean',
    default: false,
  })
  hasEmergency: boolean;

  /**
   * Has pharmacy
   */
  @Column({
    name: 'has_pharmacy',
    type: 'boolean',
    default: false,
  })
  hasPharmacy: boolean;

  /**
   * Has laboratory
   */
  @Column({
    name:  'has_laboratory',
    type: 'boolean',
    default: false,
  })
  hasLaboratory: boolean;

  /**
   * Has imaging/radiology
   */
  @Column({
    name: 'has_imaging',
    type:  'boolean',
    default:  false,
  })
  hasImaging: boolean;

  /**
   * Accepts ambulance
   */
  @Column({
    name: 'accepts_ambulance',
    type: 'boolean',
    default: false,
  })
  acceptsAmbulance: boolean;

  /**
   * Parking available
   */
  @Column({
    name: 'has_parking',
    type: 'boolean',
    default: true,
  })
  hasParking: boolean;

  /**
   * Wheelchair accessible
   */
  @Column({
    name: 'wheelchair_accessible',
    type: 'boolean',
    default: true,
  })
  wheelchairAccessible: boolean;

  /**
   * Medical aids accepted
   */
  @Column({
    name: 'accepted_medical_aids',
    type: 'text',
    array: true,
    default: [],
  })
  acceptedMedicalAids: string[];

  /**
   * Facility logo URL
   */
  @Column({
    name: 'logo_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  logoUrl: string | null;

  /**
   * Facility images
   */
  @Column({
    name: 'image_urls',
    type: 'text',
    array: true,
    default: [],
  })
  imageUrls: string[];

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
   * Facility status
   */
  @Column({
    name: 'status',
    type: 'enum',
    enum: FacilityStatus,
    default:  FacilityStatus.ACTIVE,
  })
  status: FacilityStatus;

  /**
   * Parent facility ID (for branches)
   */
  @Column({
    name: 'parent_facility_id',
    type: 'uuid',
    nullable: true,
  })
  parentFacilityId: string | null;

  /**
   * Additional metadata
   */
  @Column({
    name: 'metadata',
    type: 'jsonb',
    default: {},
  })
  metadata: Record<string, unknown>;

  // ==================== HELPER METHODS ====================

  /**
   * Check if facility is currently open
   */
  isCurrentlyOpen(): boolean {
    if (this.is24Hours) return true;
    if (! this.operatingHours) return false;

    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const today = dayNames[now.getDay()];
    const todayHours = this.operatingHours[today];

    if (!todayHours || !todayHours.isOpen) return false;

    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (todayHours.openTime && todayHours.closeTime) {
      return currentTime >= todayHours. openTime && currentTime <= todayHours.closeTime;
    }

    return false;
  }

  /**
   * Get distance from coordinates (in km)
   */
  getDistanceFrom(lat: number, lng: number): number | null {
    if (!this. latitude || !this.longitude) return null;

    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(this.latitude - lat);
    const dLon = this.toRad(this.longitude - lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat)) *
        Math.cos(this. toRad(this.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math. atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
