import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

import { Session, User } from '@ithalamed/database';
import { DeviceInfoDto } from '../auth/dto';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);
  private readonly maxActiveSessions: number;
  private readonly sessionDurationDays: number;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {
    this.maxActiveSessions = this.configService. get<number>('auth.session.maxActiveSessions') || 5;
    this.sessionDurationDays = 7; // Default 7 days
  }

  /**
   * Create a new session
   */
  async createSession(
    user: User,
    deviceInfo?:  DeviceInfoDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Session> {
    // Check for existing sessions and enforce limit
    await this.enforceSessionLimit(user. id);

    // Generate session token
    const sessionToken = this.generateSessionToken();

    // Calculate expiry
    const expiresAt = new Date(
      Date.now() + this.sessionDurationDays * 24 * 60 * 60 * 1000,
    );

    // Create session
    const session = this.sessionRepository.create({
      userId: user.id,
      sessionToken,
      deviceId: deviceInfo?.deviceId || null,
      deviceType: deviceInfo?.deviceType || this.parseDeviceType(userAgent),
      deviceName: deviceInfo?.deviceName || null,
      platform: deviceInfo?.platform || this.parsePlatform(userAgent),
      appVersion: deviceInfo?.appVersion || null,
      ipAddress:  ipAddress || null,
      userAgent: userAgent || null,
      location: null, // TODO: Implement IP geolocation
      expiresAt,
      isActive: true,
      lastActivityAt: new Date(),
    });

    const savedSession = await this.sessionRepository.save(session);

    this.logger.log(
      `Session created for user ${user.id}:  ${savedSession.id}`,
    );

    return savedSession;
  }

  /**
   * Find session by ID
   */
  async findById(sessionId: string): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: { id: sessionId },
    });
  }

  /**
   * Find active sessions for user
   */
  async findUserActiveSessions(userId: string): Promise<Session[]> {
    return this.sessionRepository.find({
      where: { userId, isActive: true },
      order: { lastActivityAt: 'DESC' },
    });
  }

  /**
   * Update session activity
   */
  async updateActivity(sessionId: string): Promise<void> {
    await this.sessionRepository.update(sessionId, {
      lastActivityAt: new Date(),
    });
  }

  /**
   * Terminate a session
   */
  async terminateSession(
    sessionId: string,
    reason: string = 'user_logout',
  ): Promise<void> {
    const session = await this.sessionRepository. findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await this.sessionRepository.update(sessionId, {
      isActive:  false,
      terminatedAt: new Date(),
      terminationReason: reason,
    });

    this.logger.log(`Session terminated:  ${sessionId}, reason: ${reason}`);
  }

  /**
   * Terminate all sessions for a user
   */
  async terminateAllUserSessions(
    userId: string,
    reason: string = 'logout_all',
  ): Promise<number> {
    const result = await this.sessionRepository.update(
      { userId, isActive: true },
      {
        isActive: false,
        terminatedAt: new Date(),
        terminationReason: reason,
      },
    );

    const terminatedCount = result.affected || 0;
    this.logger.log(
      `Terminated ${terminatedCount} sessions for user ${userId}`,
    );

    return terminatedCount;
  }

  /**
   * Enforce session limit per user
   */
  private async enforceSessionLimit(userId: string): Promise<void> {
    const activeSessions = await this.sessionRepository.find({
      where: { userId, isActive: true },
      order: { lastActivityAt:  'ASC' },
    });

    // If at or over limit, terminate oldest sessions
    if (activeSessions.length >= this.maxActiveSessions) {
      const sessionsToTerminate = activeSessions.slice(
        0,
        activeSessions.length - this.maxActiveSessions + 1,
      );

      for (const session of sessionsToTerminate) {
        await this. terminateSession(session.id, 'session_limit_exceeded');
      }
    }
  }

  /**
   * Generate secure session token
   */
  private generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Parse device type from user agent
   */
  private parseDeviceType(userAgent?: string): string {
    if (!userAgent) return 'unknown';

    const ua = userAgent.toLowerCase();

    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return 'mobile';
    }
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return 'tablet';
    }
    return 'desktop';
  }

  /**
   * Parse platform from user agent
   */
  private parsePlatform(userAgent?: string): string {
    if (!userAgent) return 'unknown';

    const ua = userAgent.toLowerCase();

    if (ua.includes('iphone') || ua.includes('ipad')) {
      return 'ios';
    }
    if (ua.includes('android')) {
      return 'android';
    }
    if (ua.includes('windows')) {
      return 'windows';
    }
    if (ua.includes('mac')) {
      return 'macos';
    }
    if (ua.includes('linux')) {
      return 'linux';
    }
    return 'web';
  }

  /**
   * Clean up expired sessions (called by cron job)
   */
  async cleanupExpiredSessions(): Promise<number> {
    const result = await this. sessionRepository.update(
      {
        isActive: true,
        expiresAt:  new Date(),
      },
      {
        isActive: false,
        terminatedAt: new Date(),
        terminationReason: 'session_expired',
      },
    );

    const terminatedCount = result. affected || 0;
    if (terminatedCount > 0) {
      this.logger.log(`Cleaned up ${terminatedCount} expired sessions`);
    }

    return terminatedCount;
  }
}
