import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MedicalAidScheme, DependentCode } from '@ithalamed/common';

/**
 * Medical Aid Response DTO
 */
export class MedicalAidResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  patientId: string;

  @ApiProperty({ enum: MedicalAidScheme })
  scheme: MedicalAidScheme;

  @ApiProperty({ example: 'Discovery Health' })
  schemeName: string;

  @ApiProperty({ example: '12345678' })
  membershipNumber: string;

  @ApiProperty({ enum: DependentCode })
  dependentCode: DependentCode;

  @ApiProperty({ example: 'Essential Saver' })
  planName: string;

  @ApiPropertyOptional({ example: 'Executive' })
  planType?: string;

  @ApiPropertyOptional()
  effectiveDate?: Date;

  @ApiPropertyOptional()
  expiryDate?: Date;

  @ApiProperty()
  isPrimary: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isVerified: boolean;

  @ApiPropertyOptional()
  verifiedAt?: Date;

  @ApiPropertyOptional({ example: 'John Mbatha' })
  mainMemberName?: string;

  @ApiPropertyOptional({ example: '+27860123456' })
  contactNumber?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
