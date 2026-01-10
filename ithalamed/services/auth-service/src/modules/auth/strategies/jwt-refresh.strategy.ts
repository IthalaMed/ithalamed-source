import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, RefreshToken } from '@ithalamed/database';
import { JwtRefreshPayload } from '../interfaces';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {
    super({
      jwtFromRequest: ExtractJwt. fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refresh. secret'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtRefreshPayload): Promise<{ user: User; refreshToken: RefreshToken }> {
    const { sub: userId, tokenId } = payload;
    const refreshTokenFromBody = request.body.refreshToken;

    // Find the refresh token record
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { id: tokenId, userId },
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!refreshToken.isValid()) {
      // Token reuse detected - revoke entire token family
      await this.refreshTokenRepository.update(
        { familyId: refreshToken.familyId },
        { isRevoked: true, revokedAt: new Date(), revocationReason: 'token_reuse_detected' },
      );
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    // Verify user exists and is active
    const user = await this.userRepository.findOne({
      where: { id:  userId },
    });

    if (!user || !user.isActive()) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return { user, refreshToken };
  }
}
