import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Import from centralized common package
import { SimpleJwtStrategy, JwtStrategyConfig } from '@ithalamed/common';

/**
 * JWT Strategy for Patient Service
 *
 * Extends SimpleJwtStrategy - no custom validation needed.
 * Just validates JWT signature and extracts user from payload.
 *
 * The Auth Service handles: 
 * - User existence validation
 * - Session validity
 * - Account status checks
 *
 * We trust the JWT issued by Auth Service.
 */
@Injectable()
export class JwtStrategy extends SimpleJwtStrategy {
  constructor(configService: ConfigService) {
    const config: JwtStrategyConfig = {
      secretOrKey: configService.get<string>('jwt.accessSecret')!,
      issuer: 'ithalamed-auth-service',
      audience: 'ithalamed-api',
    };
    super(config);
  }
}
