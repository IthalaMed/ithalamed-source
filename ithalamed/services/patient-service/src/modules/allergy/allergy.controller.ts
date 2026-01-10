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
  ParseBoolPipe,
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
import { AllergyService } from './allergy.service';
import {
  CreateAllergyDto,
  UpdateAllergyDto,
  AllergyResponseDto,
} from './dto';

@ApiTags('allergies')
@Controller('patients/:patientId/allergies')
@ApiBearerAuth('JWT-auth')
export class AllergyController {
  constructor(private readonly allergyService: AllergyService) {}

  /**
   * Create a new allergy
   */
  @Post()
  @Roles(UserType.ADMIN, UserType.PROVIDER, UserType.NURSE)
  @ApiOperation({ summary: 'Create a new allergy for a patient' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiResponse({ status: 201, type: AllergyResponseDto })
  @ApiResponse({ status: 409, description: 'Allergy already exists' })
  async create(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body() dto: CreateAllergyDto,
  ): Promise<AllergyResponseDto> {
    return this.allergyService.create(patientId, dto);
  }

  /**
   * Get all allergies for a patient
   */
  @Get()
  @Roles(
    UserType.ADMIN,
    UserType.PROVIDER,
    UserType.NURSE,
    UserType.PHARMACIST,
    UserType.EMS,
    UserType.PATIENT,
  )
  @ApiOperation({ summary: 'Get all allergies for a patient' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, type:  [AllergyResponseDto] })
  async findByPatientId(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('activeOnly') activeOnly?:  string,
  ): Promise<AllergyResponseDto[]> {
    return this.allergyService. findByPatientId(patientId, activeOnly === 'true');
  }

  /**
   * Get severe allergies (for clinical alerts)
   */
  @Get('severe')
  @Roles(
    UserType.ADMIN,
    UserType.PROVIDER,
    UserType.NURSE,
    UserType.PHARMACIST,
    UserType.EMS,
  )
  @ApiOperation({ summary: 'Get severe allergies for alerts' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiResponse({ status:  200, type: [AllergyResponseDto] })
  async getSevereAllergies(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ): Promise<AllergyResponseDto[]> {
    return this.allergyService.getSevereAllergies(patientId);
  }

  /**
   * Get life-threatening allergies
   */
  @Get('life-threatening')
  @Roles(
    UserType.ADMIN,
    UserType.PROVIDER,
    UserType.NURSE,
    UserType.PHARMACIST,
    UserType.EMS,
  )
  @ApiOperation({ summary: 'Get life-threatening allergies' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [AllergyResponseDto] })
  async getLifeThreateningAllergies(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ): Promise<AllergyResponseDto[]> {
    return this.allergyService.getLifeThreateningAllergies(patientId);
  }

  /**
   * Get allergy by ID
   */
  @Get(':id')
  @Roles(
    UserType. ADMIN,
    UserType. PROVIDER,
    UserType. NURSE,
    UserType. PHARMACIST,
    UserType. PATIENT,
  )
  @ApiOperation({ summary: 'Get a specific allergy' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: AllergyResponseDto })
  @ApiResponse({ status: 404, description: 'Allergy not found' })
  async findById(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AllergyResponseDto> {
    return this.allergyService.findById(id);
  }

  /**
   * Update an allergy
   */
  @Patch(':id')
  @Roles(UserType. ADMIN, UserType.PROVIDER, UserType.NURSE)
  @ApiOperation({ summary: 'Update an allergy' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: AllergyResponseDto })
  @ApiResponse({ status: 404, description: 'Allergy not found' })
  async update(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAllergyDto,
  ): Promise<AllergyResponseDto> {
    return this.allergyService.update(id, dto);
  }

  /**
   * Deactivate an allergy
   */
  @Patch(':id/deactivate')
  @Roles(UserType.ADMIN, UserType. PROVIDER)
  @ApiOperation({ summary:  'Deactivate an allergy' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name:  'id', format: 'uuid' })
  @ApiResponse({ status: 200, type:  AllergyResponseDto })
  @ApiResponse({ status: 404, description: 'Allergy not found' })
  async deactivate(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AllergyResponseDto> {
    return this.allergyService.deactivate(id);
  }

  /**
   * Delete an allergy permanently
   */
  @Delete(': id')
  @Roles(UserType.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an allergy permanently' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Allergy deleted' })
  @ApiResponse({ status: 404, description: 'Allergy not found' })
  async delete(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.allergyService. delete(id);
  }
}
