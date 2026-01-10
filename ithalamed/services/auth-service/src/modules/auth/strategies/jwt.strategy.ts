import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Session } from '@ithalamed/database';
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.access.secret'),
    });
  }

  async validate(payload:  JwtPayload): Promise<User> {
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

    return user;
  }
}
