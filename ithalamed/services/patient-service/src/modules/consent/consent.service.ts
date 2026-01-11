import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

// Entity from @ithalamed/database
import { PatientConsent } from '@ithalamed/database';

// Enums from @ithalamed/common
import { ConsentType } from '@ithalamed/common';

// DTOs
import {
  CreateConsentDto,
  ConsentResponseDto,
  RequiredConsentsStatusDto,
} from './dto';

@Injectable()
export class ConsentService {
  private readonly logger = new Logger(ConsentService.name);

  // Required consents for registration (POPIA compliance)
  private readonly requiredConsents: ConsentType[] = [
    ConsentType.TERMS_OF_SERVICE,
    ConsentType.PRIVACY_POLICY,
    ConsentType.DATA_PROCESSING,
  ];

  constructor(
    @InjectRepository(PatientConsent)
    private readonly consentRepository: Repository<PatientConsent>,
  ) {}

  /**
   * Record patient consent
   */
  async create(
    patientId: string,
    dto: CreateConsentDto,
  ): Promise<ConsentResponseDto> {
    // Revoke any existing active consent of same type
    await this.consentRepository.update(
      {
        patientId,
        consentType: dto.consentType,
        granted: true,
        revokedAt: IsNull(),
      },
      { revokedAt: new Date() },
    );

    const consent = this.consentRepository. create({
      patientId,
      consentType: dto. consentType,
      granted:  dto.granted,
      version: dto.version || '1.0',
      grantedAt: dto.granted ? new Date() : null,
      ipAddress: dto.ipAddress || null,
      userAgent: dto. userAgent || null,
      notes: dto.notes || null,
    });

    const saved = await this.consentRepository. save(consent);
    this.logger.log(
      `Consent recorded for patient ${patientId}:  ${dto.consentType} - ${dto.granted}`,
    );

    return this.mapToResponse(saved);
  }

  /**
   * Get all consents for a patient
   */
  async findByPatientId(patientId: string): Promise<ConsentResponseDto[]> {
    const consents = await this.consentRepository.find({
      where: { patientId },
      order: { createdAt: 'DESC' },
    });

    return consents.map((c) => this.mapToResponse(c));
  }

  /**
   * Get active consents
   */
  async getActiveConsents(patientId: string): Promise<ConsentResponseDto[]> {
    const consents = await this.consentRepository.find({
      where: {
        patientId,
        granted: true,
        revokedAt: IsNull(),
      },
      order: { consentType: 'ASC' },
    });

    return consents.map((c) => this.mapToResponse(c));
  }

  /**
   * Check if patient has specific consent
   */
  async hasConsent(patientId: string, consentType: ConsentType): Promise<boolean> {
    const consent = await this.consentRepository.findOne({
      where: {
        patientId,
        consentType,
        granted:  true,
        revokedAt: IsNull(),
      },
    });

    return !!consent;
  }

  /**
   * Revoke a consent
   */
  async revoke(
    patientId: string,
    consentType: ConsentType,
  ): Promise<ConsentResponseDto | null> {
    const consent = await this.consentRepository.findOne({
      where: {
        patientId,
        consentType,
        granted: true,
        revokedAt:  IsNull(),
      },
    });

    if (!consent) {
      return null;
    }

    consent.revokedAt = new Date();
    const updated = await this.consentRepository. save(consent);
    this.logger.log(`Consent revoked for patient ${patientId}: ${consentType}`);

    return this.mapToResponse(updated);
  }

  /**
   * Get consent history for specific type
   */
  async getConsentHistory(
    patientId: string,
    consentType: ConsentType,
  ): Promise<ConsentResponseDto[]> {
    const consents = await this.consentRepository.find({
      where: { patientId, consentType },
      order: { createdAt: 'DESC' },
    });

    return consents.map((c) => this.mapToResponse(c));
  }

  /**
   * Check if patient has all required consents (for POPIA compliance)
   */
  async hasRequiredConsents(patientId: string): Promise<RequiredConsentsStatusDto> {
    const missing:  ConsentType[] = [];

    for (const consentType of this. requiredConsents) {
      const hasConsent = await this.hasConsent(patientId, consentType);
      if (!hasConsent) {
        missing.push(consentType);
      }
    }

    return {
      hasAll: missing.length === 0,
      missing,
    };
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponse(consent: PatientConsent): ConsentResponseDto {
    return {
      id: consent.id,
      patientId: consent.patientId,
      consentType: consent.consentType,
      granted: consent.granted,
      version: consent.version || undefined,
      grantedAt:  consent.grantedAt,
      revokedAt: consent. revokedAt || undefined,
      ipAddress: consent.ipAddress || undefined,
      notes: consent.notes || undefined,
      createdAt: consent.createdAt,
      updatedAt: consent.updatedAt,
    };
  }
}
