import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditLog } from '@ithalamed/database';
import { AuditAction, UserType } from '@ithalamed/common';

export interface CreateAuditLogParams {
  action: AuditAction;
  userId?:  string;
  userType?: UserType;
  resourceType:  string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  success:  boolean;
  errorMessage?: string;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * Create audit log entry
   */
  async log(params: CreateAuditLogParams): Promise<AuditLog> {
    const {
      action,
      userId,
      userType,
      resourceType,
      resourceId,
      ipAddress,
      userAgent,
      sessionId,
      success,
      errorMessage,
      previousState,
      newState,
      metadata,
    } = params;

    const auditLog = this.auditLogRepository.create({
      action,
      userId,
      userType,
      resourceType,
      resourceId,
      ipAddress,
      userAgent,
      sessionId,
      success,
      errorMessage,
      previousState,
      newState,
      metadata,
    });

    const savedLog = await this.auditLogRepository.save(auditLog);

    // Log to console for debugging
    const logLevel = success ? 'log' : 'warn';
    this.logger[logLevel](
      `[AUDIT] ${action} | User: ${userId || 'anonymous'} | Resource: ${resourceType}: ${resourceId || 'N/A'} | Success: ${success}`,
    );

    return savedLog;
  }

  /**
   * Get audit logs for a user
   */
  async getLogsForUser(
    userId: string,
    options?:  {
      limit?: number;
      offset?: number;
      action?: AuditAction;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<{ logs: AuditLog[]; total: number }> {
    const {
      limit = 50,
      offset = 0,
      action,
      startDate,
      endDate,
    } = options || {};

    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.userId = :userId', { userId });

    if (action) {
      queryBuilder.andWhere('audit.action = :action', { action });
    }

    if (startDate) {
      queryBuilder.andWhere('audit. createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('audit.createdAt <= :endDate', { endDate });
    }

    const [logs, total] = await queryBuilder
      .orderBy('audit. createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { logs, total };
  }

  /**
   * Get audit logs for a resource
   */
  async getLogsForResource(
    resourceType: string,
    resourceId: string,
    options?: {
      limit?: number;
      offset?: number;
    },
  ): Promise<{ logs: AuditLog[]; total: number }> {
    const { limit = 50, offset = 0 } = options || {};

    const [logs, total] = await this. auditLogRepository. findAndCount({
      where:  { resourceType, resourceId },
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });

    return { logs, total };
  }

  /**
   * Get security-related audit logs
   */
  async getSecurityLogs(
    options?: {
      limit?:  number;
      offset?: number;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<{ logs: AuditLog[]; total: number }> {
    const { limit = 100, offset = 0, startDate, endDate } = options || {};

    const securityActions = [
      AuditAction.USER_LOGIN,
      AuditAction.USER_LOGIN_FAILED,
      AuditAction.USER_LOGOUT,
      AuditAction.USER_LOCKED,
      AuditAction. USER_UNLOCKED,
      AuditAction.PASSWORD_CHANGED,
      AuditAction. PASSWORD_RESET_REQUESTED,
      AuditAction.PASSWORD_RESET_COMPLETED,
      AuditAction.MFA_ENABLED,
      AuditAction. MFA_DISABLED,
      AuditAction.MFA_VERIFIED,
      AuditAction.MFA_FAILED,
    ];

    const queryBuilder = this.auditLogRepository
      . createQueryBuilder('audit')
      .where('audit.action IN (:...actions)', { actions: securityActions });

    if (startDate) {
      queryBuilder.andWhere('audit.createdAt >= : startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('audit.createdAt <= :endDate', { endDate });
    }

    const [logs, total] = await queryBuilder
      .orderBy('audit. createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { logs, total };
  }
}
