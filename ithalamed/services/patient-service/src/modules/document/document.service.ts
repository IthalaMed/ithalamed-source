import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entity from @ithalamed/database
import { PatientDocument } from '@ithalamed/database';

// DTOs
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  SearchDocumentDto,
  DocumentResponseDto,
  DocumentListResponseDto,
  DocumentCountByCategoryDto,
} from './dto';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    @InjectRepository(PatientDocument)
    private readonly documentRepository: Repository<PatientDocument>,
  ) {}

  /**
   * Create/Upload a new document
   */
  async create(
    patientId: string,
    dto: CreateDocumentDto,
  ): Promise<DocumentResponseDto> {
    const document = this. documentRepository.create({
      patientId,
      title: dto.title,
      documentType: dto.documentType,
      category: dto.category,
      description: dto.description || null,
      fileUrl: dto.fileUrl,
      mimeType: dto. mimeType,
      fileSize: dto.fileSize,
      originalFileName: dto.originalFileName || null,
      documentDate: dto.documentDate ?  new Date(dto.documentDate) : null,
      uploadedBy: dto.uploadedBy || null,
      encounterId: dto.encounterId || null,
      isArchived: false,
    });

    const saved = await this.documentRepository.save(document);
    this.logger.log(`Document created for patient ${patientId}: ${dto.title}`);

    return this.mapToResponse(saved);
  }

  /**
   * Get documents with pagination and filtering
   */
  async findByPatientId(
    patientId: string,
    searchDto: SearchDocumentDto,
  ): Promise<DocumentListResponseDto> {
    const {
      documentType,
      category,
      searchTerm,
      fromDate,
      toDate,
      includeArchived = false,
      page = 1,
      limit = 20,
    } = searchDto;

    const queryBuilder = this.documentRepository
      .createQueryBuilder('doc')
      .where('doc.patientId = :patientId', { patientId });

    if (! includeArchived) {
      queryBuilder.andWhere('doc. isArchived = :isArchived', { isArchived:  false });
    }

    if (documentType) {
      queryBuilder.andWhere('doc. documentType = :documentType', { documentType });
    }

    if (category) {
      queryBuilder.andWhere('doc. category = :category', { category });
    }

    if (searchTerm) {
      queryBuilder.andWhere(
        '(doc.title ILIKE : searchTerm OR doc.description ILIKE :searchTerm)',
        { searchTerm: `%${searchTerm}%` },
      );
    }

    if (fromDate) {
      queryBuilder.andWhere('doc. documentDate >= :fromDate', {
        fromDate:  new Date(fromDate),
      });
    }

    if (toDate) {
      queryBuilder.andWhere('doc. documentDate <= :toDate', {
        toDate: new Date(toDate),
      });
    }

    queryBuilder
      .orderBy('doc. documentDate', 'DESC')
      .addOrderBy('doc.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [documents, total] = await queryBuilder.getManyAndCount();

    return {
      documents:  documents.map((d) => this.mapToResponse(d)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get document by ID
   */
  async findById(id: string): Promise<DocumentResponseDto> {
    const document = await this. documentRepository.findOne({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return this.mapToResponse(document);
  }

  /**
   * Update document
   */
  async update(id: string, dto: UpdateDocumentDto): Promise<DocumentResponseDto> {
    const document = await this.documentRepository.findOne({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    Object.assign(document, {
      ... dto,
      documentDate: dto.documentDate
        ? new Date(dto. documentDate)
        : document. documentDate,
    });

    const updated = await this.documentRepository.save(document);
    this.logger.log(`Document updated: ${id}`);

    return this.mapToResponse(updated);
  }

  /**
   * Archive document
   */
  async archive(id: string): Promise<DocumentResponseDto> {
    const document = await this.documentRepository.findOne({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    document.isArchived = true;
    const updated = await this.documentRepository. save(document);
    this.logger.log(`Document archived: ${id}`);

    return this.mapToResponse(updated);
  }

  /**
   * Unarchive document
   */
  async unarchive(id:  string): Promise<DocumentResponseDto> {
    const document = await this.documentRepository.findOne({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    document.isArchived = false;
    const updated = await this. documentRepository.save(document);
    this.logger.log(`Document unarchived: ${id}`);

    return this.mapToResponse(updated);
  }

  /**
   * Delete document permanently
   */
  async delete(id: string): Promise<void> {
    const document = await this.documentRepository.findOne({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    await this.documentRepository.remove(document);
    this.logger.log(`Document deleted: ${id}`);

    // TODO: Delete file from storage service
  }

  /**
   * Get documents by encounter
   */
  async findByEncounterId(encounterId: string): Promise<DocumentResponseDto[]> {
    const documents = await this.documentRepository. find({
      where: { encounterId, isArchived: false },
      order: { createdAt: 'DESC' },
    });

    return documents.map((d) => this.mapToResponse(d));
  }

  /**
   * Get document count by category
   */
  async getCountByCategory(patientId: string): Promise<DocumentCountByCategoryDto[]> {
    const result = await this.documentRepository
      .createQueryBuilder('doc')
      .select('doc.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .where('doc.patientId = : patientId', { patientId })
      .andWhere('doc.isArchived = false')
      .groupBy('doc.category')
      .getRawMany();

    return result.map((r) => ({
      category: r.category,
      count: parseInt(r.count, 10),
    }));
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponse(document: PatientDocument): DocumentResponseDto {
    return {
      id: document.id,
      patientId: document.patientId,
      title: document.title,
      documentType: document. documentType,
      category: document.category,
      description: document.description || undefined,
      fileUrl: document. fileUrl,
      mimeType: document.mimeType,
      fileSize: document.fileSize,
      originalFileName: document. originalFileName || undefined,
      documentDate: document.documentDate || undefined,
      uploadedBy:  document.uploadedBy || undefined,
      encounterId: document. encounterId || undefined,
      isArchived: document.isArchived,
      createdAt:  document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
