import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

// Entity from @ithalamed/database
import { Patient } from '@ithalamed/database';

// Enums and utils from @ithalamed/common
import { PatientStatus, validateSouthAfricanId, IdType } from '@ithalamed/common';

// DTOs
import {
  CreatePatientDto,
  UpdatePatientDto,
  SearchPatientDto,
  PatientResponseDto,
  PatientSummaryDto,
  PatientListResponseDto,
} from './dto';

@Injectable()
export class PatientService {
  private readonly logger = new Logger(PatientService.name);
  private readonly patientNumberPrefix:  string;

  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    private readonly configService: ConfigService,
  ) {
    this.patientNumberPrefix = 'PT';
  }

  /**
   * Create a new patient
   * FR-PAT-001: Patient registration
   */
  async create(dto: CreatePatientDto): Promise<PatientResponseDto> {
    // Validate SA ID if applicable
    if (dto.idType === IdType.SA_ID) {
      const validation = validateSouthAfricanId(dto.idNumber);
      if (! validation.isValid) {
        throw new BadRequestException(validation. errorMessage);
      }
    }

    // Check for existing patient by ID number
    const existingByIdNumber = await this.patientRepository.findOne({
      where: { idNumber: dto.idNumber },
    });

    if (existingByIdNumber) {
      throw new ConflictException('A patient with this ID number already exists');
    }

    // Check for existing patient by phone
    const existingByPhone = await this.patientRepository. findOne({
      where: { phoneNumber: dto.phoneNumber },
    });

    if (existingByPhone) {
      throw new ConflictException('A patient with this phone number already exists');
    }

    // Check if userId is already linked
    if (dto.userId) {
      const existingByUser = await this.patientRepository. findOne({
        where: { userId: dto.userId },
      });

      if (existingByUser) {
        throw new ConflictException('A patient profile already exists for this user');
      }
    }

    // Generate patient number
    const patientNumber = await this.generatePatientNumber();

    // Create patient entity
    const patient = this.patientRepository.create({
      ...dto,
      patientNumber,
      dateOfBirth: new Date(dto.dateOfBirth),
      email: dto.email?. toLowerCase() || null,
      status: PatientStatus.ACTIVE,
    });

    const savedPatient = await this.patientRepository.save(patient);

    this.logger.log(`Patient created:  ${savedPatient.patientNumber}`);

    return this.mapToResponse(savedPatient);
  }

  /**
   * Find patient by ID
   */
  async findById(id: string): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.mapToResponse(patient);
  }

  /**
   * Find patient by user ID (linked account)
   */
  async findByUserId(userId: string): Promise<PatientResponseDto | null> {
    const patient = await this.patientRepository.findOne({
      where: { userId },
    });

    return patient ? this.mapToResponse(patient) : null;
  }

  /**
   * Find patient by patient number
   */
  async findByPatientNumber(patientNumber: string): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { patientNumber },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.mapToResponse(patient);
  }

  /**
   * Find patient by phone number
   */
  async findByPhoneNumber(phoneNumber:  string): Promise<PatientResponseDto | null> {
    const patient = await this.patientRepository. findOne({
      where: { phoneNumber },
    });

    return patient ? this.mapToResponse(patient) : null;
  }

  /**
   * Update patient
   */
  async update(id: string, dto: UpdatePatientDto): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Check phone uniqueness if updating
    if (dto.phoneNumber && dto.phoneNumber !== patient.phoneNumber) {
      const existingByPhone = await this.patientRepository.findOne({
        where: { phoneNumber: dto.phoneNumber },
      });

      if (existingByPhone && existingByPhone.id !== id) {
        throw new ConflictException('Phone number already in use');
      }
    }

    // Check email uniqueness if updating
    if (dto.email && dto.email. toLowerCase() !== patient.email) {
      const existingByEmail = await this.patientRepository.findOne({
        where: { email: dto.email. toLowerCase() },
      });

      if (existingByEmail && existingByEmail.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    // Update patient
    Object.assign(patient, {
      ...dto,
      email: dto.email?.toLowerCase() ?? patient.email,
    });

    const updatedPatient = await this.patientRepository. save(patient);

    this.logger.log(`Patient updated: ${updatedPatient.patientNumber}`);

    return this.mapToResponse(updatedPatient);
  }

  /**
   * Update patient status
   */
  async updateStatus(id: string, status: PatientStatus): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    patient.status = status;
    const updatedPatient = await this.patientRepository. save(patient);

    this.logger.log(`Patient status updated: ${patient.patientNumber} -> ${status}`);

    return this.mapToResponse(updatedPatient);
  }

  /**
   * Search patients with pagination
   */
  async search(dto: SearchPatientDto): Promise<PatientListResponseDto> {
    const {
      query,
      gender,
      status,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = dto;

    const queryBuilder = this.patientRepository. createQueryBuilder('patient');

    // Apply search query
    if (query) {
      queryBuilder.andWhere(
        `(
          patient.firstName ILIKE : query OR 
          patient.lastName ILIKE :query OR 
          patient. patientNumber ILIKE :query OR 
          patient.phoneNumber ILIKE :query
        )`,
        { query: `%${query}%` },
      );
    }

    // Apply filters
    if (gender) {
      queryBuilder.andWhere('patient.gender = :gender', { gender });
    }

    if (status) {
      queryBuilder.andWhere('patient.status = :status', { status });
    }

    // Exclude deleted
    queryBuilder.andWhere('patient.deletedAt IS NULL');

    // Sorting
    const validSortFields = ['createdAt', 'firstName', 'lastName', 'patientNumber', 'dateOfBirth'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`patient.${sortField}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [patients, total] = await queryBuilder.getManyAndCount();

    return {
      patients:  patients.map((p) => this.mapToSummary(p)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Link patient to user account
   */
  async linkToUser(patientId: string, userId: string): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    if (patient.userId) {
      throw new ConflictException('Patient is already linked to a user account');
    }

    // Check if user is already linked to another patient
    const existingByUser = await this.patientRepository.findOne({
      where: { userId },
    });

    if (existingByUser) {
      throw new ConflictException('User is already linked to another patient profile');
    }

    patient.userId = userId;
    const updatedPatient = await this. patientRepository.save(patient);

    this.logger.log(`Patient ${patient.patientNumber} linked to user ${userId}`);

    return this.mapToResponse(updatedPatient);
  }

  /**
   * Soft delete patient
   */
  async softDelete(id: string): Promise<void> {
    const patient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    await this.patientRepository.softDelete(id);

    this.logger.log(`Patient soft deleted: ${patient.patientNumber}`);
  }

  /**
   * Generate unique patient number:  PT + YEAR + 8-digit sequence
   */
  private async generatePatientNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `${this.patientNumberPrefix}${year}`;

    const lastPatient = await this.patientRepository
      .createQueryBuilder('patient')
      .where('patient.patientNumber LIKE :prefix', { prefix:  `${prefix}%` })
      .orderBy('patient.patientNumber', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastPatient) {
      const lastSequence = parseInt(lastPatient.patientNumber.slice(-8), 10);
      sequence = lastSequence + 1;
    }

    return `${prefix}${sequence. toString().padStart(8, '0')}`;
  }

  /**
   * Calculate age from date of birth
   */
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Map Patient entity to full response DTO
   */
  private mapToResponse(patient: Patient): PatientResponseDto {
    return {
      id: patient.id,
      patientNumber: patient. patientNumber,
      userId: patient.userId || undefined,
      firstName: patient.firstName,
      middleName: patient.middleName || undefined,
      lastName: patient. lastName,
      fullName: this.getFullName(patient),
      dateOfBirth: patient.dateOfBirth,
      age: this.calculateAge(patient.dateOfBirth),
      gender: patient.gender,
      bloodType: patient.bloodType || undefined,
      phoneNumber: patient.phoneNumber,
      email: patient.email || undefined,
      address: patient. address,
      preferredLanguage: patient.preferredLanguage,
      ethnicity: patient.ethnicity || undefined,
      religion:  patient.religion || undefined,
      maritalStatus: patient.maritalStatus || undefined,
      occupation:  patient.occupation || undefined,
      employer: patient.employer || undefined,
      profilePhotoUrl: patient.profilePhotoUrl || undefined,
      status: patient.status,
      createdAt: patient. createdAt,
      updatedAt: patient.updatedAt,
    };
  }

  /**
   * Map Patient entity to summary DTO
   */
  private mapToSummary(patient: Patient): PatientSummaryDto {
    return {
      id: patient.id,
      patientNumber: patient. patientNumber,
      fullName: this.getFullName(patient),
      dateOfBirth:  patient.dateOfBirth,
      age: this.calculateAge(patient.dateOfBirth),
      gender: patient.gender,
      phoneNumber: patient.phoneNumber,
      profilePhotoUrl: patient.profilePhotoUrl || undefined,
      status: patient. status,
    };
  }

  /**
   * Get full name from patient
   */
  private getFullName(patient: Patient): string {
    const parts = [patient.firstName];
    if (patient.middleName) parts.push(patient. middleName);
    parts.push(patient.lastName);
    return parts.join(' ');
  }
}
