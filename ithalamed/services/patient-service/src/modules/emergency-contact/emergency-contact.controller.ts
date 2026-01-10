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
import { EmergencyContactService } from './emergency-contact. service';
import {
  CreateEmergencyContactDto,
  UpdateEmergencyContactDto,
  EmergencyContactResponseDto,
} from './dto';

@ApiTags('emergency-contacts')
@Controller('patients/:patientId/emergency-contacts')
@ApiBearerAuth('JWT-auth')
export class EmergencyContactController {
  constructor(private readonly contactService: EmergencyContactService) {}

  /**
   * Create a new emergency contact
   */
  @Post()
  @Roles(UserType.ADMIN, UserType.PROVIDER, UserType.NURSE, UserType.PATIENT)
  @ApiOperation({ summary: 'Create a new emergency contact' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiResponse({ status: 201, type: EmergencyContactResponseDto })
  @ApiResponse({ status: 400, description: 'Validation failed or duplicate' })
  async create(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body() dto: CreateEmergencyContactDto,
  ): Promise<EmergencyContactResponseDto> {
    return this.contactService.create(patientId, dto);
  }

  /**
   * Get all emergency contacts
   */
  @Get()
  @Roles(
    UserType.ADMIN,
    UserType.PROVIDER,
    UserType.NURSE,
    UserType.EMS,
    UserType. PATIENT,
  )
  @ApiOperation({ summary: 'Get all emergency contacts for a patient' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [EmergencyContactResponseDto] })
  async findByPatientId(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('activeOnly') activeOnly?:  string,
  ): Promise<EmergencyContactResponseDto[]> {
    return this.contactService. findByPatientId(patientId, activeOnly === 'true');
  }

  /**
   * Get primary emergency contact
   */
  @Get('primary')
  @Roles(
    UserType.ADMIN,
    UserType.PROVIDER,
    UserType.NURSE,
    UserType.EMS,
    UserType.PATIENT,
  )
  @ApiOperation({ summary: 'Get primary emergency contact' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiResponse({ status:  200, type: EmergencyContactResponseDto })
  async getPrimaryContact(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ): Promise<EmergencyContactResponseDto | null> {
    return this.contactService.getPrimaryContact(patientId);
  }

  /**
   * Check minimum contacts status
   */
  @Get('status')
  @Roles(UserType.ADMIN, UserType. PROVIDER, UserType.PATIENT)
  @ApiOperation({ summary: 'Check if patient has minimum required contacts' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiResponse({ status: 200 })
  async getStatus(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ): Promise<{ hasMinimum: boolean; count: number; required: number }> {
    const [hasMinimum, count] = await Promise.all([
      this.contactService.hasMinimumContacts(patientId),
      this.contactService.getContactCount(patientId),
    ]);
    return { hasMinimum, count, required: 2 };
  }

  /**
   * Get contact by ID
   */
  @Get(':id')
  @Roles(
    UserType.ADMIN,
    UserType.PROVIDER,
    UserType.NURSE,
    UserType.EMS,
    UserType.PATIENT,
  )
  @ApiOperation({ summary: 'Get a specific emergency contact' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: EmergencyContactResponseDto })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async findById(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EmergencyContactResponseDto> {
    return this.contactService.findById(id);
  }

  /**
   * Update an emergency contact
   */
  @Patch(':id')
  @Roles(UserType. ADMIN, UserType.PROVIDER, UserType.NURSE, UserType. PATIENT)
  @ApiOperation({ summary: 'Update an emergency contact' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: EmergencyContactResponseDto })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async update(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEmergencyContactDto,
  ): Promise<EmergencyContactResponseDto> {
    return this.contactService.update(id, dto);
  }

  /**
   * Delete an emergency contact
   */
  @Delete(': id')
  @Roles(UserType.ADMIN, UserType.PATIENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an emergency contact' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Contact deleted' })
  @ApiResponse({ status: 400, description: 'Cannot delete - minimum required' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async delete(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.contactService.delete(id);
  }
}
