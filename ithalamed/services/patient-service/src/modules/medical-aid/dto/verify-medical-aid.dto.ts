import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Verify Medical Aid DTO
 */
export class VerifyMedicalAidDto {
  @ApiProperty({ description: 'Verification status' })
  @IsBoolean()
  isVerified: boolean;

  @ApiPropertyOptional({ description: 'Verification notes', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  verificationNotes?: string;
}
