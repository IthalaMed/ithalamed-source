import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entity from @ithalamed/database
import { PatientAllergy } from '@ithalamed/database';

// Enums from @ithalamed/common
import { AllergySeverity } from '@ithalamed/common';

// DTOs
import {
  CreateAllergyDto,
  UpdateAllergyDto,
  AllergyResponseDto,
} from './dto';

@Injectable()
export class AllergyService {
  private readonly logger = new Logger(AllergyService.name);

  constructor(
    @InjectRepository(PatientAllergy)
    private readonly allergyRepository: Repository<PatientAllergy>,
  ) {}

  /**
   * Create a new allergy record
   */
  async create(
    patientId: string,
    dto: CreateAllergyDto,
  ): Promise<AllergyResponseDto> {
    // Check for duplicate
    const existing = await this.allergyRepository. findOne({
      where: {
        patientId,
        allergen: dto.allergen,
        allergyType: dto.allergyType,
        isActive: true,
      },
    });

    if (existing) {
      throw new ConflictException('This allergy is already recorded for the patient');
    }

    const allergy = this.allergyRepository.create({
      patientId,
      allergen: dto. allergen,
      allergyType: dto.allergyType,
      severity: dto.severity,
      reaction: dto.reaction || null,
      onsetDate:  dto.onsetDate ?  new Date(dto.onsetDate) : null,
      notes:  dto.notes || null,
      isActive: dto.isActive ??  true,
      recordedBy:  dto.recordedBy || null,
    });

    const saved = await this.allergyRepository. save(allergy);
    this.logger.log(`Allergy created for patient ${patientId}: ${dto.allergen}`);

    return this.mapToResponse(saved);
  }

  /**
   * Get all allergies for a patient
   */
  async findByPatientId(
    patientId: string,
    activeOnly: boolean = false,
  ): Promise<AllergyResponseDto[]> {
    const where:  any = { patientId };
    if (activeOnly) {
      where.isActive = true;
    }

    const allergies = await this.allergyRepository.find({
      where,
      order:  { severity: 'DESC', allergen: 'ASC' },
    });

    return allergies. map((a) => this.mapToResponse(a));
  }

  /**
   * Get severe allergies (for alerts)
   */
  async getSevereAllergies(patientId: string): Promise<AllergyResponseDto[]> {
    const allergies = await this. allergyRepository.find({
      where: {
        patientId,
        isActive: true,
        severity: AllergySeverity. SEVERE,
      },
    });

    return allergies.map((a) => this.mapToResponse(a));
  }

  /**
   * Get life-threatening allergies
   */
  async getLifeThreateningAllergies(patientId: string): Promise<AllergyResponseDto[]> {
    const allergies = await this.allergyRepository.find({
      where: {
        patientId,
        isActive: true,
        severity: AllergySeverity.LIFE_THREATENING,
      },
    });

    return allergies.map((a) => this.mapToResponse(a));
  }

  /**
   * Get allergy by ID
   */
  async findById(id: string): Promise<AllergyResponseDto> {
    const allergy = await this.allergyRepository.findOne({
      where: { id },
    });

    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }

    return this.mapToResponse(allergy);
  }

  /**
   * Update an allergy
   */
  async update(id: string, dto: UpdateAllergyDto): Promise<AllergyResponseDto> {
    const allergy = await this.allergyRepository.findOne({
      where: { id },
    });

    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }

    Object.assign(allergy, {
      ...dto,
      onsetDate: dto.onsetDate ? new Date(dto.onsetDate) : allergy.onsetDate,
    });

    const updated = await this.allergyRepository.save(allergy);
    this.logger.log(`Allergy updated: ${id}`);

    return this.mapToResponse(updated);
  }

  /**
   * Deactivate an allergy (soft delete)
   */
  async deactivate(id: string): Promise<AllergyResponseDto> {
    const allergy = await this.allergyRepository.findOne({
      where: { id },
    });

    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }

    allergy.isActive = false;
    const updated = await this.allergyRepository.save(allergy);
    this.logger.log(`Allergy deactivated: ${id}`);

    return this.mapToResponse(updated);
  }

  /**
   * Delete an allergy permanently
   */
  async delete(id: string): Promise<void> {
    const allergy = await this.allergyRepository.findOne({
      where: { id },
    });

    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }

    await this. allergyRepository.remove(allergy);
    this.logger.log(`Allergy deleted: ${id}`);
  }

  /**
   * Check if patient has specific allergy (for drug interaction)
   */
  async hasAllergy(patientId: string, allergen: string): Promise<boolean> {
    const count = await this.allergyRepository. count({
      where: {
        patientId,
        allergen,
        isActive: true,
      },
    });

    return count > 0;
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponse(allergy: PatientAllergy): AllergyResponseDto {
    return {
      id: allergy.id,
      patientId: allergy. patientId,
      allergen: allergy.allergen,
      allergyType: allergy. allergyType,
      severity:  allergy.severity,
      reaction: allergy.reaction || undefined,
      onsetDate: allergy.onsetDate || undefined,
      notes: allergy.notes || undefined,
      isActive: allergy.isActive,
      recordedBy: allergy.recordedBy || undefined,
      createdAt: allergy. createdAt,
      updatedAt: allergy.updatedAt,
    };
  }
}
