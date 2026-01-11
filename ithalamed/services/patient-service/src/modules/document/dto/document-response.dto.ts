import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType, DocumentCategory } from '@ithalamed/common';

/**
 * Document Response DTO
 */
export class DocumentResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  patientId: string;

  @ApiProperty({ example: 'Lab Report - Blood Test' })
  title: string;

  @ApiProperty({ enum: DocumentType })
  documentType: DocumentType;

  @ApiProperty({ enum: DocumentCategory })
  category: DocumentCategory;

  @ApiPropertyOptional()
  description?:  string;

  @ApiProperty({ example: 'https://storage.ithalamed.com/documents/xyz.pdf' })
  fileUrl:  string;

  @ApiProperty({ example: 'application/pdf' })
  mimeType: string;

  @ApiProperty({ example: 1024000 })
  fileSize: number;

  @ApiPropertyOptional({ example: 'lab_report_2024.pdf' })
  originalFileName?: string;

  @ApiPropertyOptional()
  documentDate?: Date;

  @ApiPropertyOptional()
  uploadedBy?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  encounterId?: string;

  @ApiProperty()
  isArchived: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

/**
 * Paginated Document List Response
 */
export class DocumentListResponseDto {
  @ApiProperty({ type: [DocumentResponseDto] })
  documents: DocumentResponseDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example:  20 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}

/**
 * Document Count by Category Response
 */
export class DocumentCountByCategoryDto {
  @ApiProperty()
  category: string;

  @ApiProperty()
  count: number;
}
