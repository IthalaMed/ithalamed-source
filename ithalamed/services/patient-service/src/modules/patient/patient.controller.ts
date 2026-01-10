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
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

// Import from @ithalamed/common - NO LOCAL DUPLICATES
import {
  CurrentUser,
  Roles,
  Public,
  AuthenticatedUser,
  UserType,
  PatientStatus,
} from '@ithalamed/common';

// Service and DTOs
import { PatientService } from './patient.service';
import {
  CreatePatientDto,
  UpdatePatientDto,
  SearchPatientDto,
  PatientResponseDto,
  PatientListResponseDto,
} from './dto';

@ApiTags('patients')
@Controller('patients')
@ApiBearerAuth('JWT-auth')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  // ==================== CURRENT USER ENDPOINTS ====================

  /**
   * Get current user's patient profile
   */
  @Get('me')
  @Roles(UserType.PATIENT)
  @ApiOperation({ summary: "Get current user's patient profile" })
  @ApiResponse({ status:  200, type: PatientResponseDto })
  @ApiResponse({ status: 404, description: 'Patient profile not found' })
  async getMyProfile(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PatientResponseDto> {
    const patient = await this.patientService.findByUserId(user.id);
    if (!patient) {
      throw new NotFoundException('Patient profile not found for this user');
    }
    return patient;
  }

  /**
   * Update current user's patient profile
   */
  @Patch('me')
  @Roles(UserType.PATIENT)
  @ApiOperation({ summary: "Update current user's patient profile" })
  @ApiResponse({ status:  200, type: PatientResponseDto })
  @ApiResponse({ status: 404, description: 'Patient profile not found' })
  async updateMyProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePatientDto,
  ): Promise<PatientResponseDto> {
    const patient = await this.patientService.findByUserId(user.id);
    if (!patient) {
      throw new NotFoundException('Patient profile not found for this user');
    }
    return this.patientService.update(patient.id, dto);
  }

  // ==================== SEARCH ====================

  /**
   * Search patients
   */
  @Get('search')
  @Roles(UserType.ADMIN, UserType.PROVIDER, UserType.NURSE, UserType.HOSPITAL_ADMIN)
  @ApiOperation({ summary: 'Search patients' })
  @ApiResponse({ status: 200, type: PatientListResponseDto })
  async search(@Query() dto: SearchPatientDto): Promise<PatientListResponseDto> {
    return this.patientService.search(dto);
  }

  // ==================== LOOKUP ENDPOINTS ====================

  /**
   * Get patient by patient number
   */
  @Get('by-number/:patientNumber')
  @Roles(
    UserType.ADMIN,
    UserType.PROVIDER,
    UserType.NURSE,
    UserType.PHARMACIST,
    UserType.LAB_TECHNICIAN,
    UserType.EMS,
  )
  @ApiOperation({ summary: 'Get patient by patient number' })
  @ApiParam({ name: 'patientNumber', example: 'PT202400000001' })
  @ApiResponse({ status: 200, type: PatientResponseDto })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async findByPatientNumber(
    @Param('patientNumber') patientNumber: string,
  ): Promise<PatientResponseDto> {
    return this.patientService.findByPatientNumber(patientNumber);
  }

  /**
   * Get patient by phone number
   */
  @Get('by-phone/:phoneNumber')
  @Roles(UserType.ADMIN, UserType. PROVIDER, UserType.NURSE)
  @ApiOperation({ summary: 'Get patient by phone number' })
  @ApiParam({ name: 'phoneNumber', example: '+27821234567' })
  @ApiResponse({ status: 200, type: PatientResponseDto })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async findByPhoneNumber(
    @Param('phoneNumber') phoneNumber: string,
  ): Promise<PatientResponseDto> {
    const patient = await this.patientService.findByPhoneNumber(phoneNumber);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  // ==================== CRUD ENDPOINTS ====================

  /**
   * Create a new patient
   */
  @Post()
  @Roles(UserType.ADMIN, UserType.PROVIDER, UserType.HOSPITAL_ADMIN)
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({ status: 201, type: PatientResponseDto })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 409, description: 'Patient already exists' })
  async create(@Body() dto: CreatePatientDto): Promise<PatientResponseDto> {
    return this.patientService.create(dto);
  }

  /**
   * Get patient by ID
   */
  @Get(': id')
  @Roles(
    UserType.ADMIN,
    UserType.PROVIDER,
    UserType.NURSE,
    UserType.PHARMACIST,
    UserType.LAB_TECHNICIAN,
    UserType.EMS,
  )
  @ApiOperation({ summary: 'Get patient by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: PatientResponseDto })
  @ApiResponse({ status: 404, description:  'Patient not found' })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PatientResponseDto> {
    return this.patientService.findById(id);
  }

  /**
   * Update patient by ID
   */
  @Patch(': id')
  @Roles(UserType.ADMIN, UserType.PROVIDER, UserType. HOSPITAL_ADMIN)
  @ApiOperation({ summary: 'Update patient by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status:  200, type: PatientResponseDto })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePatientDto,
  ): Promise<PatientResponseDto> {
    return this.patientService.update(id, dto);
  }

  /**
   * Update patient status
   */
  @Patch(': id/status')
  @Roles(UserType.ADMIN, UserType.HOSPITAL_ADMIN)
  @ApiOperation({ summary: 'Update patient status' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: PatientResponseDto })
  @ApiResponse({ status:  404, description: 'Patient not found' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: PatientStatus,
  ): Promise<PatientResponseDto> {
    return this.patientService.updateStatus(id, status);
  }

  /**
   * Link patient to user account
   */
  @Post(':id/link-user')
  @Roles(UserType.ADMIN, UserType.SYSTEM)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Link patient to user account' })
  @ApiParam({ name: 'id', format:  'uuid' })
  @ApiResponse({ status: 200, type: PatientResponseDto })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 409, description: 'Already linked' })
  async linkToUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('userId', ParseUUIDPipe) userId: string,
  ): Promise<PatientResponseDto> {
    return this.patientService. linkToUser(id, userId);
  }

  /**
   * Soft delete patient
   */
  @Delete(':id')
  @Roles(UserType. ADMIN, UserType.SYSTEM)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete patient' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Patient deleted' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async softDelete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.patientService.softDelete(id);
  }
}
