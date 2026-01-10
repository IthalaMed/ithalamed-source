import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Import base strategy from common
import {
  BaseJwtStrategy,
  JwtPayload,
  AuthenticatedUser,
} from '@ithalamed/common';

// Service-specific imports
import { User, Session } from '@ithalamed/database';

/**
 * Auth Service JWT Strategy
 * 
 * Extends the base strategy to add session validation
 */
@Injectable()
export class JwtStrategy extends BaseJwtStrategy {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {
    super({
      secretOrKey: configService.get<string>('jwt. access.secret')!,
    });
  }

  /**
   * Override validate to add custom logic
   */
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const { sub:  userId, sessionId } = payload;

    // Verify user exists and is active
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive()) {
      throw new UnauthorizedException('Account is not active');
    }

    // Verify session is still valid
    if (sessionId) {
      const session = await this.sessionRepository.findOne({
        where: { id: sessionId, userId, isActive: true },
      });

      if (!session || session.isExpired()) {
        throw new UnauthorizedException('Session expired or invalid');
      }

      // Update last activity
      await this.sessionRepository. update(session.id, {
        lastActivityAt: new Date(),
      });
    }

    return {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      userType: user.userType,
      sessionId,
    };
  }
}
