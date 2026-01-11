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
  ApiQuery,
} from '@nestjs/swagger';

// Import from @ithalamed/common
import { Roles, UserType } from '@ithalamed/common';

// Service and DTOs
import { MedicalAidService } from './medical-aid.service';
import {
  CreateMedicalAidDto,
  UpdateMedicalAidDto,
  VerifyMedicalAidDto,
  MedicalAidResponseDto,
} from './dto';

@ApiTags('medical-aid')
@Controller('patients/:patientId/medical-aid')
@ApiBearerAuth('JWT-auth')
export class MedicalAidController {
  constructor(private readonly medicalAidService: MedicalAidService) {}

  /**
   * Create a new medical aid record
   */
  @Post()
  @Roles(UserType.ADMIN, UserType. PROVIDER, UserType.HOSPITAL_ADMIN, UserType. PATIENT)
  @ApiOperation({ summary: 'Create a new medical aid record' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiResponse({ status: 201, type: MedicalAidResponseDto })
  @ApiResponse({ status: 409, description: 'Medical aid already exists' })
  async create(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body() dto: CreateMedicalAidDto,
  ): Promise<MedicalAidResponseDto> {
    return this.medicalAidService.create(patientId, dto);
  }

  /**
   * Get all medical aid records
   */
  @Get()
  @Roles(
    UserType.ADMIN,
    UserType.PROVIDER,
    UserType.NURSE,
    UserType.PHARMACIST,
    UserType. HOSPITAL_ADMIN,
    UserType.PATIENT,
  )
  @ApiOperation({ summary: 'Get all medical aid records for a patient' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [MedicalAidResponseDto] })
  async findByPatientId(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('activeOnly') activeOnly?:  string,
  ): Promise<MedicalAidResponseDto[]> {
    return this.medicalAidService.findByPatientId(patientId, activeOnly === 'true');
  }

  /**
   * Get primary medical aid
   */
  @Get('primary')
  @Roles(
    UserType.ADMIN,
    UserType.PROVIDER,
    UserType.NURSE,
    UserType.PHARMACIST,
    UserType.HOSPITAL_ADMIN,
    UserType.PATIENT,
  )
  @ApiOperation({ summary: 'Get primary medical aid' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiResponse({ status: 200, type: MedicalAidResponseDto })
  async getPrimaryMedicalAid(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ): Promise<MedicalAidResponseDto | null> {
    return this.medicalAidService.getPrimaryMedicalAid(patientId);
  }

  /**
   * Get medical aid by ID
   */
  @Get(':id')
  @Roles(
    UserType. ADMIN,
    UserType. PROVIDER,
    UserType. NURSE,
    UserType. PHARMACIST,
    UserType.HOSPITAL_ADMIN,
    UserType.PATIENT,
  )
  @ApiOperation({ summary: 'Get a specific medical aid record' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: MedicalAidResponseDto })
  @ApiResponse({ status: 404, description:  'Medical aid not found' })
  async findById(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MedicalAidResponseDto> {
    return this.medicalAidService.findById(id);
  }

  /**
   * Update medical aid
   */
  @Patch(':id')
  @Roles(UserType.ADMIN, UserType. PROVIDER, UserType.HOSPITAL_ADMIN, UserType. PATIENT)
  @ApiOperation({ summary: 'Update a medical aid record' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name:  'id', format: 'uuid' })
  @ApiResponse({ status: 200, type:  MedicalAidResponseDto })
  @ApiResponse({ status:  404, description: 'Medical aid not found' })
  async update(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMedicalAidDto,
  ): Promise<MedicalAidResponseDto> {
    return this. medicalAidService.update(id, dto);
  }

  /**
   * Verify medical aid membership
   */
  @Patch(':id/verify')
  @Roles(UserType. ADMIN, UserType.SYSTEM, UserType.HOSPITAL_ADMIN)
  @ApiOperation({ summary:  'Verify medical aid membership' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: MedicalAidResponseDto })
  @ApiResponse({ status: 404, description: 'Medical aid not found' })
  async verify(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VerifyMedicalAidDto,
  ): Promise<MedicalAidResponseDto> {
    return this.medicalAidService.verify(id, dto);
  }

  /**
   * Set medical aid as primary
   */
  @Patch(':id/set-primary')
  @Roles(UserType.ADMIN, UserType.PROVIDER, UserType.HOSPITAL_ADMIN, UserType.PATIENT)
  @ApiOperation({ summary:  'Set medical aid as primary' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: MedicalAidResponseDto })
  @ApiResponse({ status: 400, description: 'Cannot set inactive as primary' })
  @ApiResponse({ status: 404, description: 'Medical aid not found' })
  async setPrimary(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MedicalAidResponseDto> {
    return this.medicalAidService.setPrimary(id);
  }

  /**
   * Deactivate medical aid
   */
  @Patch(':id/deactivate')
  @Roles(UserType.ADMIN, UserType. PROVIDER, UserType.HOSPITAL_ADMIN, UserType.PATIENT)
  @ApiOperation({ summary: 'Deactivate medical aid' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name:  'id', format: 'uuid' })
  @ApiResponse({ status: 200, type:  MedicalAidResponseDto })
  @ApiResponse({ status:  404, description: 'Medical aid not found' })
  async deactivate(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MedicalAidResponseDto> {
    return this.medicalAidService. deactivate(id);
  }

  /**
   * Delete medical aid
   */
  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.SYSTEM)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete medical aid permanently' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Medical aid deleted' })
  @ApiResponse({ status: 404, description: 'Medical aid not found' })
  async delete(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.medicalAidService.delete(id);
  }
}
