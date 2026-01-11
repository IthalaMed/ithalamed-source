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
import { ChronicConditionService } from './chronic-condition.service';
import {
  CreateChronicConditionDto,
  UpdateChronicConditionDto,
  ChronicConditionResponseDto,
} from './dto';

@ApiTags('chronic-conditions')
@Controller('patients/:patientId/chronic-conditions')
@ApiBearerAuth('JWT-auth')
export class ChronicConditionController {
  constructor(private readonly conditionService: ChronicConditionService) {}

  /**
   * Create a new chronic condition
   */
  @Post()
  @Roles(UserType. ADMIN, UserType.PROVIDER, UserType.NURSE)
  @ApiOperation({ summary: 'Create a new chronic condition' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiResponse({ status: 201, type: ChronicConditionResponseDto })
  @ApiResponse({ status: 409, description: 'Condition already exists' })
  async create(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body() dto: CreateChronicConditionDto,
  ): Promise<ChronicConditionResponseDto> {
    return this.conditionService.create(patientId, dto);
  }

  /**
   * Get all chronic conditions
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
  @ApiOperation({ summary: 'Get all chronic conditions for a patient' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiQuery({ name:  'activeOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, type:  [ChronicConditionResponseDto] })
  async findByPatientId(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('activeOnly') activeOnly?:  string,
  ): Promise<ChronicConditionResponseDto[]> {
    return this.conditionService.findByPatientId(patientId, activeOnly === 'true');
  }

  /**
   * Get active chronic conditions (for clinical summary)
   */
  @Get('active')
  @Roles(
    UserType.ADMIN,
    UserType.PROVIDER,
    UserType.NURSE,
    UserType.PHARMACIST,
    UserType.EMS,
  )
  @ApiOperation({ summary: 'Get active chronic conditions for clinical summary' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiResponse({ status: 200, type:  [ChronicConditionResponseDto] })
  async getActiveConditions(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ): Promise<ChronicConditionResponseDto[]> {
    return this.conditionService.getActiveConditions(patientId);
  }

  /**
   * Get condition by ID
   */
  @Get(':id')
  @Roles(
    UserType. ADMIN,
    UserType. PROVIDER,
    UserType. NURSE,
    UserType. PHARMACIST,
    UserType. PATIENT,
  )
  @ApiOperation({ summary: 'Get a specific chronic condition' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: ChronicConditionResponseDto })
  @ApiResponse({ status: 404, description:  'Condition not found' })
  async findById(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ChronicConditionResponseDto> {
    return this.conditionService. findById(id);
  }

  /**
   * Update a chronic condition
   */
  @Patch(':id')
  @Roles(UserType.ADMIN, UserType.PROVIDER, UserType.NURSE)
  @ApiOperation({ summary: 'Update a chronic condition' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name: 'id', format:  'uuid' })
  @ApiResponse({ status: 200, type: ChronicConditionResponseDto })
  @ApiResponse({ status: 404, description: 'Condition not found' })
  async update(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateChronicConditionDto,
  ): Promise<ChronicConditionResponseDto> {
    return this.conditionService.update(id, dto);
  }

  /**
   * Deactivate a chronic condition
   */
  @Patch(':id/deactivate')
  @Roles(UserType.ADMIN, UserType. PROVIDER)
  @ApiOperation({ summary:  'Deactivate a chronic condition' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name:  'id', format: 'uuid' })
  @ApiResponse({ status: 200, type:  ChronicConditionResponseDto })
  @ApiResponse({ status:  404, description: 'Condition not found' })
  async deactivate(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ChronicConditionResponseDto> {
    return this.conditionService.deactivate(id);
  }

  /**
   * Delete a chronic condition permanently
   */
  @Delete(': id')
  @Roles(UserType.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a chronic condition permanently' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Condition deleted' })
  @ApiResponse({ status: 404, description: 'Condition not found' })
  async delete(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.conditionService.delete(id);
  }
}
