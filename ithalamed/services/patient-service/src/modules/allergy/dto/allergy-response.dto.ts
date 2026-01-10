import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AllergyType, AllergySeverity } from '@ithalamed/common';

/**
 * Allergy Response DTO
 */
export class AllergyResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  patientId: string;

  @ApiProperty({ example: 'Penicillin' })
  allergen: string;

  @ApiProperty({ enum:  AllergyType })
  allergyType: AllergyType;

  @ApiProperty({ enum:  AllergySeverity })
  severity: AllergySeverity;

  @ApiPropertyOptional({ example: 'Rash, hives' })
  reaction?: string;

  @ApiPropertyOptional()
  onsetDate?: Date;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  isActive:  boolean;

  @ApiPropertyOptional()
  recordedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
