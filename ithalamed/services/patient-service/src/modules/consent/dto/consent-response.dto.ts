import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConsentType } from '@ithalamed/common';

/**
 * Consent Response DTO
 */
export class ConsentResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  patientId: string;

  @ApiProperty({ enum: ConsentType })
  consentType: ConsentType;

  @ApiProperty()
  granted: boolean;

  @ApiPropertyOptional({ example: '1.0' })
  version?: string;

  @ApiProperty()
  grantedAt: Date;

  @ApiPropertyOptional()
  revokedAt?: Date;

  @ApiPropertyOptional()
  ipAddress?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

/**
 * Required Consents Status Response
 */
export class RequiredConsentsStatusDto {
  @ApiProperty({ description: 'Whether all required consents are granted' })
  hasAll: boolean;

  @ApiProperty({ 
    description: 'List of missing required consent types',
    enum: ConsentType,
    isArray: true,
  })
  missing: ConsentType[];
}
