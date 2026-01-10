import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, BloodType, PatientStatus, Address } from '@ithalamed/common';

/**
 * Patient Response DTO
 * Full patient profile returned from API
 */
export class PatientResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'PT202400000001' })
  patientNumber: string;

  @ApiPropertyOptional({ format: 'uuid' })
  userId?: string;

  @ApiProperty({ example:  'Thandi' })
  firstName: string;

  @ApiPropertyOptional({ example: 'Grace' })
  middleName?: string;

  @ApiProperty({ example: 'Mbatha' })
  lastName: string;

  @ApiProperty({ example: 'Thandi Grace Mbatha' })
  fullName: string;

  @ApiProperty({ example: '1985-01-15' })
  dateOfBirth: Date;

  @ApiProperty({ example: 39 })
  age: number;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiPropertyOptional({ enum: BloodType })
  bloodType?: BloodType;

  @ApiProperty({ example: '+27821234567' })
  phoneNumber: string;

  @ApiPropertyOptional({ example: 'thandi@example.com' })
  email?:  string;

  @ApiProperty()
  address: Address;

  @ApiProperty({ example: 'en' })
  preferredLanguage:  string;

  @ApiPropertyOptional({ example: 'Zulu' })
  ethnicity?: string;

  @ApiPropertyOptional({ example: 'Christian' })
  religion?: string;

  @ApiPropertyOptional({ example: 'Married' })
  maritalStatus?: string;

  @ApiPropertyOptional({ example: 'Software Developer' })
  occupation?: string;

  @ApiPropertyOptional({ example:  'TechCorp Ltd' })
  employer?: string;

  @ApiPropertyOptional()
  profilePhotoUrl?: string;

  @ApiProperty({ enum: PatientStatus })
  status: PatientStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

/**
 * Patient Summary DTO
 * Abbreviated patient info for lists
 */
export class PatientSummaryDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'PT202400000001' })
  patientNumber: string;

  @ApiProperty({ example: 'Thandi Grace Mbatha' })
  fullName: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty({ example: 39 })
  age: number;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiProperty({ example: '+27821234567' })
  phoneNumber: string;

  @ApiPropertyOptional()
  profilePhotoUrl?: string;

  @ApiProperty({ enum: PatientStatus })
  status: PatientStatus;
}

/**
 * Paginated Patient List Response
 */
export class PatientListResponseDto {
  @ApiProperty({ type: [PatientSummaryDto] })
  patients: PatientSummaryDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example:  20 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}
