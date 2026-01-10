import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entity from @ithalamed/database
import { PatientEmergencyContact } from '@ithalamed/database';

// DTOs
import {
  CreateEmergencyContactDto,
  UpdateEmergencyContactDto,
  EmergencyContactResponseDto,
} from './dto';

@Injectable()
export class EmergencyContactService {
  private readonly logger = new Logger(EmergencyContactService.name);
  
  // FR-PAT-006: Minimum 2 emergency contacts required
  private readonly minimumContacts = 2;

  constructor(
    @InjectRepository(PatientEmergencyContact)
    private readonly contactRepository: Repository<PatientEmergencyContact>,
  ) {}

  /**
   * Create a new emergency contact
   */
  async create(
    patientId: string,
    dto: CreateEmergencyContactDto,
  ): Promise<EmergencyContactResponseDto> {
    // Check for duplicate phone
    const existing = await this.contactRepository.findOne({
      where: { patientId, phoneNumber: dto. phoneNumber },
    });

    if (existing) {
      throw new BadRequestException(
        'An emergency contact with this phone number already exists',
      );
    }

    const contact = this.contactRepository.create({
      patientId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      relationship: dto.relationship,
      phoneNumber: dto.phoneNumber,
      alternativePhone: dto.alternativePhone || null,
      email: dto.email?. toLowerCase() || null,
      priority: dto.priority,
      isActive: dto.isActive ??  true,
      notes: dto. notes || null,
    });

    const saved = await this.contactRepository.save(contact);
    this.logger.log(`Emergency contact created for patient ${patientId}`);

    return this.mapToResponse(saved);
  }

  /**
   * Get all emergency contacts for a patient
   */
  async findByPatientId(
    patientId: string,
    activeOnly: boolean = false,
  ): Promise<EmergencyContactResponseDto[]> {
    const where:  any = { patientId };
    if (activeOnly) {
      where.isActive = true;
    }

    const contacts = await this.contactRepository.find({
      where,
      order: { priority: 'ASC', createdAt: 'ASC' },
    });

    return contacts.map((c) => this.mapToResponse(c));
  }

  /**
   * Get primary emergency contact
   */
  async getPrimaryContact(patientId: string): Promise<EmergencyContactResponseDto | null> {
    const contact = await this.contactRepository.findOne({
      where: { patientId, priority: 1, isActive: true },
    });

    return contact ? this.mapToResponse(contact) : null;
  }

  /**
   * Get contact by ID
   */
  async findById(id: string): Promise<EmergencyContactResponseDto> {
    const contact = await this.contactRepository.findOne({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Emergency contact not found');
    }

    return this.mapToResponse(contact);
  }

  /**
   * Update an emergency contact
   */
  async update(
    id: string,
    dto: UpdateEmergencyContactDto,
  ): Promise<EmergencyContactResponseDto> {
    const contact = await this.contactRepository.findOne({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Emergency contact not found');
    }

    // Check phone uniqueness if updating
    if (dto.phoneNumber && dto.phoneNumber !== contact.phoneNumber) {
      const existing = await this.contactRepository.findOne({
        where: { patientId: contact.patientId, phoneNumber: dto.phoneNumber },
      });

      if (existing && existing.id !== id) {
        throw new BadRequestException(
          'An emergency contact with this phone number already exists',
        );
      }
    }

    Object.assign(contact, {
      ... dto,
      email: dto.email?.toLowerCase() ?? contact.email,
    });

    const updated = await this.contactRepository.save(contact);
    this.logger.log(`Emergency contact updated:  ${id}`);

    return this.mapToResponse(updated);
  }

  /**
   * Delete an emergency contact
   */
  async delete(id: string): Promise<void> {
    const contact = await this.contactRepository. findOne({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Emergency contact not found');
    }

    // Check minimum contacts requirement
    const activeCount = await this.contactRepository.count({
      where: { patientId: contact.patientId, isActive: true },
    });

    if (activeCount <= this.minimumContacts) {
      throw new BadRequestException(
        `Cannot delete.  Minimum ${this.minimumContacts} emergency contacts required. `,
      );
    }

    await this.contactRepository.remove(contact);
    this.logger.log(`Emergency contact deleted: ${id}`);
  }

  /**
   * Check if patient has minimum required contacts
   */
  async hasMinimumContacts(patientId: string): Promise<boolean> {
    const count = await this. contactRepository.count({
      where: { patientId, isActive: true },
    });
    return count >= this.minimumContacts;
  }

  /**
   * Get contact count
   */
  async getContactCount(patientId: string): Promise<number> {
    return this.contactRepository.count({
      where: { patientId, isActive: true },
    });
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponse(contact: PatientEmergencyContact): EmergencyContactResponseDto {
    return {
      id: contact.id,
      patientId: contact.patientId,
      firstName: contact.firstName,
      lastName: contact.lastName,
      fullName: `${contact.firstName} ${contact.lastName}`,
      relationship: contact.relationship,
      phoneNumber: contact.phoneNumber,
      alternativePhone: contact.alternativePhone || undefined,
      email: contact.email || undefined,
      priority: contact. priority,
      isActive: contact.isActive,
      notes: contact.notes || undefined,
      createdAt:  contact.createdAt,
      updatedAt: contact.updatedAt,
    };
  }
}
