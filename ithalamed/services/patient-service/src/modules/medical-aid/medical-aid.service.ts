import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entity from @ithalamed/database
import { PatientMedicalAid } from '@ithalamed/database';

// Utils from @ithalamed/common
import { getMedicalAidSchemeName } from '@ithalamed/common';

// DTOs
import {
  CreateMedicalAidDto,
  UpdateMedicalAidDto,
  VerifyMedicalAidDto,
  MedicalAidResponseDto,
} from './dto';

@Injectable()
export class MedicalAidService {
  private readonly logger = new Logger(MedicalAidService.name);

  constructor(
    @InjectRepository(PatientMedicalAid)
    private readonly medicalAidRepository: Repository<PatientMedicalAid>,
  ) {}

  /**
   * Create a new medical aid record
   */
  async create(
    patientId: string,
    dto: CreateMedicalAidDto,
  ): Promise<MedicalAidResponseDto> {
    // Check for duplicate
    const existing = await this.medicalAidRepository.findOne({
      where: {
        patientId,
        scheme: dto.scheme,
        membershipNumber: dto.membershipNumber,
      },
    });

    if (existing) {
      throw new ConflictException('This medical aid membership is already registered');
    }

    // If setting as primary, unset existing primary
    if (dto.isPrimary) {
      await this.medicalAidRepository. update(
        { patientId, isPrimary: true },
        { isPrimary:  false },
      );
    }

    const medicalAid = this.medicalAidRepository.create({
      patientId,
      scheme: dto.scheme,
      membershipNumber: dto.membershipNumber,
      dependentCode: dto.dependentCode,
      planName: dto.planName,
      planType: dto.planType || null,
      effectiveDate: dto.effectiveDate ?  new Date(dto.effectiveDate) : null,
      expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
      isPrimary: dto.isPrimary ??  false,
      isActive: dto.isActive ?? true,
      isVerified: false,
      mainMemberName: dto.mainMemberName || null,
      contactNumber: dto.contactNumber || null,
    });

    const saved = await this.medicalAidRepository.save(medicalAid);
    this.logger.log(`Medical aid created for patient ${patientId}:  ${dto.scheme}`);

    return this.mapToResponse(saved);
  }

  /**
   * Get all medical aid records for a patient
   */
  async findByPatientId(
    patientId: string,
    activeOnly: boolean = false,
  ): Promise<MedicalAidResponseDto[]> {
    const where:  any = { patientId };
    if (activeOnly) {
      where.isActive = true;
    }

    const records = await this.medicalAidRepository.find({
      where,
      order: { isPrimary: 'DESC', createdAt: 'ASC' },
    });

    return records.map((r) => this.mapToResponse(r));
  }

  /**
   * Get primary medical aid
   */
  async getPrimaryMedicalAid(patientId: string): Promise<MedicalAidResponseDto | null> {
    const record = await this.medicalAidRepository. findOne({
      where: { patientId, isPrimary:  true, isActive: true },
    });

    return record ? this.mapToResponse(record) : null;
  }

  /**
   * Get medical aid by ID
   */
  async findById(id: string): Promise<MedicalAidResponseDto> {
    const record = await this.medicalAidRepository.findOne({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException('Medical aid record not found');
    }

    return this.mapToResponse(record);
  }

  /**
   * Update medical aid
   */
  async update(
    id: string,
    dto: UpdateMedicalAidDto,
  ): Promise<MedicalAidResponseDto> {
    const record = await this. medicalAidRepository.findOne({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException('Medical aid record not found');
    }

    // If setting as primary, unset existing primary
    if (dto.isPrimary && ! record.isPrimary) {
      await this.medicalAidRepository.update(
        { patientId: record.patientId, isPrimary: true },
        { isPrimary:  false },
      );
    }

    Object.assign(record, {
      ... dto,
      effectiveDate: dto.effectiveDate
        ? new Date(dto.effectiveDate)
        : record.effectiveDate,
      expiryDate: dto.expiryDate
        ? new Date(dto.expiryDate)
        : record.expiryDate,
    });

    const updated = await this.medicalAidRepository.save(record);
    this.logger.log(`Medical aid updated:  ${id}`);

    return this.mapToResponse(updated);
  }

  /**
   * Verify medical aid membership
   */
  async verify(
    id: string,
    dto: VerifyMedicalAidDto,
  ): Promise<MedicalAidResponseDto> {
    const record = await this.medicalAidRepository. findOne({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException('Medical aid record not found');
    }

    record.isVerified = dto.isVerified;
    record.verifiedAt = dto.isVerified ? new Date() : null;

    const updated = await this.medicalAidRepository.save(record);
    this.logger.log(`Medical aid verification:  ${id} - ${dto.isVerified}`);

    return this.mapToResponse(updated);
  }

  /**
   * Set as primary
   */
  async setPrimary(id: string): Promise<MedicalAidResponseDto> {
    const record = await this.medicalAidRepository. findOne({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException('Medical aid record not found');
    }

    if (! record.isActive) {
      throw new BadRequestException('Cannot set inactive medical aid as primary');
    }

    // Unset existing primary
    await this.medicalAidRepository.update(
      { patientId:  record.patientId, isPrimary: true },
      { isPrimary: false },
    );

    record.isPrimary = true;
    const updated = await this.medicalAidRepository.save(record);
    this.logger.log(`Medical aid set as primary: ${id}`);

    return this.mapToResponse(updated);
  }

  /**
   * Deactivate medical aid
   */
  async deactivate(id:  string): Promise<MedicalAidResponseDto> {
    const record = await this.medicalAidRepository.findOne({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException('Medical aid record not found');
    }

    record.isActive = false;
    record.isPrimary = false;

    const updated = await this.medicalAidRepository.save(record);
    this.logger.log(`Medical aid deactivated: ${id}`);

    return this.mapToResponse(updated);
  }

  /**
   * Delete medical aid
   */
  async delete(id: string): Promise<void> {
    const record = await this.medicalAidRepository.findOne({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException('Medical aid record not found');
    }

    await this.medicalAidRepository. remove(record);
    this.logger.log(`Medical aid deleted: ${id}`);
  }

  /**
   * Check if patient has verified medical aid
   */
  async hasVerifiedMedicalAid(patientId: string): Promise<boolean> {
    const count = await this.medicalAidRepository.count({
      where: { patientId, isActive: true, isVerified: true },
    });
    return count > 0;
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponse(record:  PatientMedicalAid): MedicalAidResponseDto {
    return {
      id:  record.id,
      patientId: record.patientId,
      scheme: record.scheme,
      schemeName: getMedicalAidSchemeName(record.scheme),
      membershipNumber: record.membershipNumber,
      dependentCode: record.dependentCode,
      planName:  record.planName,
      planType: record.planType || undefined,
      effectiveDate: record.effectiveDate || undefined,
      expiryDate: record.expiryDate || undefined,
      isPrimary:  record.isPrimary,
      isActive: record.isActive,
      isVerified: record. isVerified,
      verifiedAt: record.verifiedAt || undefined,
      mainMemberName: record.mainMemberName || undefined,
      contactNumber: record.contactNumber || undefined,
      createdAt: record.createdAt,
      updatedAt:  record.updatedAt,
    };
  }
}
