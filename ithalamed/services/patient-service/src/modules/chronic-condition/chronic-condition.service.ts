import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entity from @ithalamed/database
import { PatientChronicCondition } from '@ithalamed/database';

// Enums from @ithalamed/common
import { ChronicConditionStatus } from '@ithalamed/common';

// DTOs
import {
  CreateChronicConditionDto,
  UpdateChronicConditionDto,
  ChronicConditionResponseDto,
} from './dto';

@Injectable()
export class ChronicConditionService {
  private readonly logger = new Logger(ChronicConditionService.name);

  constructor(
    @InjectRepository(PatientChronicCondition)
    private readonly conditionRepository: Repository<PatientChronicCondition>,
  ) {}

  /**
   * Create a new chronic condition
   */
  async create(
    patientId: string,
    dto: CreateChronicConditionDto,
  ): Promise<ChronicConditionResponseDto> {
    // Check for duplicate active condition
    const existing = await this.conditionRepository. findOne({
      where: {
        patientId,
        conditionName: dto.conditionName,
        isActive: true,
      },
    });

    if (existing) {
      throw new ConflictException('This condition is already recorded for the patient');
    }

    const condition = this.conditionRepository.create({
      patientId,
      conditionName: dto.conditionName,
      icd10Code: dto.icd10Code || null,
      status: dto. status,
      severity: dto.severity || null,
      diagnosisDate: dto.diagnosisDate ?  new Date(dto.diagnosisDate) : null,
      notes: dto.notes || null,
      currentTreatment: dto.currentTreatment || null,
      diagnosedBy:  dto.diagnosedBy || null,
      isActive: dto.isActive ?? true,
    });

    const saved = await this.conditionRepository. save(condition);
    this.logger.log(`Chronic condition created for patient ${patientId}:  ${dto.conditionName}`);

    return this.mapToResponse(saved);
  }

  /**
   * Get all chronic conditions for a patient
   */
  async findByPatientId(
    patientId: string,
    activeOnly: boolean = false,
  ): Promise<ChronicConditionResponseDto[]> {
    const where:  any = { patientId };
    if (activeOnly) {
      where.isActive = true;
    }

    const conditions = await this.conditionRepository. find({
      where,
      order: { status: 'ASC', conditionName: 'ASC' },
    });

    return conditions.map((c) => this.mapToResponse(c));
  }

  /**
   * Get active chronic conditions (for clinical summary)
   */
  async getActiveConditions(patientId: string): Promise<ChronicConditionResponseDto[]> {
    const conditions = await this.conditionRepository.find({
      where: {
        patientId,
        isActive: true,
        status: ChronicConditionStatus.ACTIVE,
      },
      order: { severity: 'DESC', conditionName: 'ASC' },
    });

    return conditions.map((c) => this.mapToResponse(c));
  }

  /**
   * Get condition by ID
   */
  async findById(id: string): Promise<ChronicConditionResponseDto> {
    const condition = await this.conditionRepository.findOne({
      where: { id },
    });

    if (!condition) {
      throw new NotFoundException('Chronic condition not found');
    }

    return this.mapToResponse(condition);
  }

  /**
   * Update a chronic condition
   */
  async update(
    id: string,
    dto: UpdateChronicConditionDto,
  ): Promise<ChronicConditionResponseDto> {
    const condition = await this.conditionRepository.findOne({
      where: { id },
    });

    if (!condition) {
      throw new NotFoundException('Chronic condition not found');
    }

    Object.assign(condition, {
      ...dto,
      diagnosisDate: dto.diagnosisDate
        ? new Date(dto.diagnosisDate)
        : condition.diagnosisDate,
      resolutionDate: dto.resolutionDate
        ? new Date(dto.resolutionDate)
        : condition.resolutionDate,
    });

    // Auto-set resolution date when marking as resolved
    if (dto. status === ChronicConditionStatus. RESOLVED && !condition.resolutionDate) {
      condition.resolutionDate = new Date();
    }

    const updated = await this.conditionRepository.save(condition);
    this.logger.log(`Chronic condition updated: ${id}`);

    return this.mapToResponse(updated);
  }

  /**
   * Deactivate a chronic condition
   */
  async deactivate(id: string): Promise<ChronicConditionResponseDto> {
    const condition = await this.conditionRepository.findOne({
      where: { id },
    });

    if (!condition) {
      throw new NotFoundException('Chronic condition not found');
    }

    condition.isActive = false;
    const updated = await this.conditionRepository.save(condition);
    this.logger.log(`Chronic condition deactivated: ${id}`);

    return this.mapToResponse(updated);
  }

  /**
   * Delete a chronic condition permanently
   */
  async delete(id: string): Promise<void> {
    const condition = await this.conditionRepository.findOne({
      where: { id },
    });

    if (!condition) {
      throw new NotFoundException('Chronic condition not found');
    }

    await this.conditionRepository.remove(condition);
    this.logger.log(`Chronic condition deleted: ${id}`);
  }

  /**
   * Check if patient has specific condition
   */
  async hasCondition(patientId: string, conditionName: string): Promise<boolean> {
    const count = await this.conditionRepository. count({
      where: {
        patientId,
        conditionName,
        isActive:  true,
        status: ChronicConditionStatus.ACTIVE,
      },
    });
    return count > 0;
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponse(condition:  PatientChronicCondition): ChronicConditionResponseDto {
    return {
      id:  condition.id,
      patientId: condition.patientId,
      conditionName: condition. conditionName,
      icd10Code: condition.icd10Code || undefined,
      status: condition.status,
      severity: condition.severity || undefined,
      diagnosisDate: condition.diagnosisDate || undefined,
      notes: condition. notes || undefined,
      currentTreatment: condition.currentTreatment || undefined,
      diagnosedBy: condition.diagnosedBy || undefined,
      resolutionDate: condition.resolutionDate || undefined,
      isActive: condition.isActive,
      createdAt: condition. createdAt,
      updatedAt: condition.updatedAt,
    };
  }
}
