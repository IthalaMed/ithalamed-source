import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

// Import from @ithalamed/common
import { Roles, UserType } from '@ithalamed/common';

// Service and DTOs
import { DocumentService } from './document.service';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  SearchDocumentDto,
  DocumentResponseDto,
  DocumentListResponseDto,
  DocumentCountByCategoryDto,
} from './dto';

@ApiTags('documents')
@Controller('patients/:patientId/documents')
@ApiBearerAuth('JWT-auth')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  /**
   * Upload a new document
   */
  @Post()
  @Roles(UserType.ADMIN, UserType.PROVIDER, UserType.NURSE, UserType.PATIENT)
  @ApiOperation({ summary: 'Upload a new document' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiResponse({ status: 201, type: DocumentResponseDto })
  async create(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body() dto: CreateDocumentDto,
  ): Promise<DocumentResponseDto> {
    return this.documentService.create(patientId, dto);
  }

  /**
   * Get documents with search and filtering
   */
  @Get()
  @Roles(
    UserType.ADMIN,
    UserType.PROVIDER,
    UserType.NURSE,
    UserType.PHARMACIST,
    UserType.LAB_TECHNICIAN,
    UserType.PATIENT,
  )
  @ApiOperation({ summary: 'Get documents with search and filtering' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiResponse({ status: 200, type:  DocumentListResponseDto })
  async findByPatientId(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query() searchDto: SearchDocumentDto,
  ): Promise<DocumentListResponseDto> {
    return this.documentService.findByPatientId(patientId, searchDto);
  }

  /**
   * Get document count by category
   */
  @Get('count-by-category')
  @Roles(UserType.ADMIN, UserType.PROVIDER, UserType.NURSE, UserType.PATIENT)
  @ApiOperation({ summary: 'Get document count by category' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [DocumentCountByCategoryDto] })
  async getCountByCategory(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ): Promise<DocumentCountByCategoryDto[]> {
    return this.documentService.getCountByCategory(patientId);
  }

  /**
   * Get document by ID
   */
  @Get(':id')
  @Roles(
    UserType.ADMIN,
    UserType.PROVIDER,
    UserType.NURSE,
    UserType.PHARMACIST,
    UserType.LAB_TECHNICIAN,
    UserType.PATIENT,
  )
  @ApiOperation({ summary: 'Get a specific document' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: DocumentResponseDto })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async findById(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DocumentResponseDto> {
    return this. documentService.findById(id);
  }

  /**
   * Update document
   */
  @Patch(':id')
  @Roles(UserType. ADMIN, UserType.PROVIDER, UserType.NURSE, UserType.PATIENT)
  @ApiOperation({ summary: 'Update a document' })
  @ApiParam({ name:  'patientId', format:  'uuid' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status:  200, type: DocumentResponseDto })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async update(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDocumentDto,
  ): Promise<DocumentResponseDto> {
    return this. documentService.update(id, dto);
  }

  /**
   * Archive document
   */
  @Patch(':id/archive')
  @Roles(UserType.ADMIN, UserType. PROVIDER, UserType.PATIENT)
  @ApiOperation({ summary: 'Archive a document' })
  @ApiParam({ name:  'patientId', format:  'uuid' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status:  200, type: DocumentResponseDto })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async archive(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DocumentResponseDto> {
    return this.documentService.archive(id);
  }

  /**
   * Unarchive document
   */
  @Patch(':id/unarchive')
  @Roles(UserType.ADMIN, UserType. PROVIDER, UserType.PATIENT)
  @ApiOperation({ summary:  'Unarchive a document' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: DocumentResponseDto })
  @ApiResponse({ status: 404, description:  'Document not found' })
  async unarchive(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DocumentResponseDto> {
    return this. documentService.unarchive(id);
  }

  /**
   * Delete document permanently
   */
  @Delete(':id')
  @Roles(UserType. ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a document permanently' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Document deleted' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async delete(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.documentService.delete(id);
  }
}
