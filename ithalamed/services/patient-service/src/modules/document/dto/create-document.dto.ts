import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsInt,
  IsUUID,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Import from @ithalamed/common
import { DocumentType, DocumentCategory } from '@ithalamed/common';

/**
 * Create Document DTO
 */
export class CreateDocumentDto {
  @ApiProperty({ example: 'Lab Report - Blood Test', minLength: 2, maxLength: 255 })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title: string;

  @ApiProperty({ enum: DocumentType, example: DocumentType.LAB_RESULT })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({ enum: DocumentCategory, example: DocumentCategory.MEDICAL })
  @IsEnum(DocumentCategory)
  category: DocumentCategory;

  @ApiPropertyOptional({ example: 'Annual blood work results', maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ 
    example: 'https://storage.ithalamed.com/documents/xyz. pdf',
    description: 'File URL from storage service',
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500)
  fileUrl: string;

  @ApiProperty({ example: 'application/pdf', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  mimeType: string;

  @ApiProperty({ example:  1024000, description: 'File size in bytes', minimum: 1 })
  @IsInt()
  @Min(1)
  fileSize: number;

  @ApiPropertyOptional({ example: 'lab_report_2024.pdf', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  originalFileName?: string;

  @ApiPropertyOptional({ example: '2024-01-15', description: 'Document date' })
  @IsOptional()
  @IsDateString()
  documentDate?: string;

  @ApiPropertyOptional({ description: 'Provider who uploaded', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  uploadedBy?: string;

  @ApiPropertyOptional({ description: 'Related encounter/appointment ID', format: 'uuid' })
  @IsOptional()
  @IsUUID('4')
  encounterId?: string;
}
