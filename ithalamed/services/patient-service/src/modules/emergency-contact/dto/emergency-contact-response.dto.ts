import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Relationship } from '@ithalamed/common';

/**
 * Emergency Contact Response DTO
 */
export class EmergencyContactResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  patientId: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Mbatha' })
  lastName: string;

  @ApiProperty({ example: 'John Mbatha' })
  fullName: string;

  @ApiProperty({ enum: Relationship })
  relationship: Relationship;

  @ApiProperty({ example: '+27829876543' })
  phoneNumber: string;

  @ApiPropertyOptional({ example: '+27119876543' })
  alternativePhone?: string;

  @ApiPropertyOptional({ example: 'john.mbatha@example.com' })
  email?: string;

  @ApiProperty({ example:  1 })
  priority: number;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
