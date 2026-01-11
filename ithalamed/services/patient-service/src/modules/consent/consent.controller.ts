import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Request } from 'express';

// Import from @ithalamed/common
import { Roles, UserType, ConsentType } from '@ithalamed/common';

// Service and DTOs
import { ConsentService } from './consent.service';
import {
  CreateConsentDto,
  ConsentResponseDto,
  RequiredConsentsStatusDto,
} from './dto';

@ApiTags('consents')
@Controller('patients/:patientId/consents')
@ApiBearerAuth('JWT-auth')
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  /**
   * Record patient consent
   */
  @Post()
  @Roles(UserType.ADMIN, UserType.SYSTEM, UserType.PATIENT)
  @ApiOperation({ summary: 'Record patient consent' })
  @ApiParam({ name:  'patientId', format:  'uuid' })
  @ApiResponse({ status: 201, type: ConsentResponseDto })
  async create(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body() dto: CreateConsentDto,
    @Req() req: Request,
  ): Promise<ConsentResponseDto> {
    // Auto-populate IP and user agent
    const createDto:  CreateConsentDto = {
      ... dto,
      ipAddress: dto.ipAddress || req.ip || req.socket.remoteAddress,
      userAgent: dto.userAgent || req.headers['user-agent'],
    };

    return this.consentService.create(patientId, createDto);
  }

  /**
   * Get all consents
   */
  @Get()
  @Roles(UserType. ADMIN, UserType.SYSTEM, UserType.PATIENT)
  @ApiOperation({ summary: 'Get all consents for a patient' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiResponse({ status:  200, type: [ConsentResponseDto] })
  async findByPatientId(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ): Promise<ConsentResponseDto[]> {
    return this. consentService.findByPatientId(patientId);
  }

  /**
   * Get active consents
   */
  @Get('active')
  @Roles(UserType.ADMIN, UserType.SYSTEM, UserType. PATIENT)
  @ApiOperation({ summary: 'Get active consents' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [ConsentResponseDto] })
  async getActiveConsents(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ): Promise<ConsentResponseDto[]> {
    return this.consentService.getActiveConsents(patientId);
  }

  /**
   * Check required consents status (POPIA compliance)
   */
  @Get('required-status')
  @Roles(UserType.ADMIN, UserType. SYSTEM, UserType.PATIENT)
  @ApiOperation({ summary: 'Check if patient has all required consents' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiResponse({ status: 200, type: RequiredConsentsStatusDto })
  async getRequiredConsentsStatus(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ): Promise<RequiredConsentsStatusDto> {
    return this. consentService.hasRequiredConsents(patientId);
  }

  /**
   * Check specific consent
   */
  @Get('check/:consentType')
  @Roles(UserType.ADMIN, UserType.SYSTEM, UserType.PROVIDER, UserType.PATIENT)
  @ApiOperation({ summary: 'Check if patient has specific consent' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name: 'consentType', enum: ConsentType })
  @ApiResponse({ status: 200 })
  async hasConsent(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('consentType') consentType: ConsentType,
  ): Promise<{ hasConsent: boolean }> {
    const hasConsent = await this.consentService.hasConsent(patientId, consentType);
    return { hasConsent };
  }

  /**
   * Revoke a consent
   */
  @Post('revoke/:consentType')
  @Roles(UserType.ADMIN, UserType. SYSTEM, UserType.PATIENT)
  @ApiOperation({ summary: 'Revoke a consent' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name: 'consentType', enum: ConsentType })
  @ApiResponse({ status: 200, type: ConsentResponseDto })
  async revoke(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('consentType') consentType: ConsentType,
  ): Promise<ConsentResponseDto | null> {
    return this.consentService.revoke(patientId, consentType);
  }

  /**
   * Get consent history for type
   */
  @Get('history/:consentType')
  @Roles(UserType. ADMIN, UserType.SYSTEM, UserType.PATIENT)
  @ApiOperation({ summary: 'Get consent history for a specific type' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiParam({ name:  'consentType', enum:  ConsentType })
  @ApiResponse({ status: 200, type: [ConsentResponseDto] })
  async getConsentHistory(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Param('consentType') consentType: ConsentType,
  ): Promise<ConsentResponseDto[]> {
    return this.consentService.getConsentHistory(patientId, consentType);
  }
}
