import {
  IsEnum,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Import from @ithalamed/common
import { ConsentType } from '@ithalamed/common';

/**
 * Create Consent DTO
 * FR-PAT-007:  POPIA/GDPR compliant privacy consent
 */
export class CreateConsentDto {
  @ApiProperty({ enum: ConsentType, example: ConsentType.TERMS_OF_SERVICE })
  @IsEnum(ConsentType)
  consentType: ConsentType;

  @ApiProperty({ description: 'Whether consent is granted' })
  @IsBoolean()
  granted: boolean;

  @ApiPropertyOptional({ description: 'Consent document version', example: '1.0', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  version?: string;

  @ApiPropertyOptional({ description: 'IP address (auto-populated)', maxLength: 45 })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User agent (auto-populated)', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  userAgent?: string;

  @ApiPropertyOptional({ description: 'Additional notes', maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
