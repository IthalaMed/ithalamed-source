import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { UserType } from '../../enums';

/**
 * JWT Payload interface
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string | null;
  phoneNumber: string;
  userType: UserType;
  sessionId?:  string;
  iat?: number;
  exp?:  number;
}

/**
 * Authenticated User interface
 */
export interface AuthenticatedUser {
  id: string;
  email: string | null;
  phoneNumber: string;
  userType: UserType;
  sessionId?: string;
}

/**
 * JWT Strategy Options
 */
export interface JwtStrategyOptions {
  secretOrKey: string;
  validateUser?: (payload: JwtPayload) => Promise<AuthenticatedUser | null>;
}

/**
 * Base JWT Strategy
 * 
 * This is a base strategy that can be extended by services. 
 * Each service can override the validate method to add custom logic.
 */
@Injectable()
export class BaseJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(options: JwtStrategyOptions) {
    const strategyOptions:  StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: options.secretOrKey,
    };

    super(strategyOptions);
  }

  /**
   * Validate JWT payload and return authenticated user
   * Override this method in service-specific strategies for custom validation
   */
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    if (!payload. sub) {
      throw new UnauthorizedException('Invalid token:  missing user ID');
    }

    return {
      id: payload.sub,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      userType: payload.userType,
      sessionId: payload.sessionId,
    };
  }
}

/**
 * Factory function to create a JWT strategy with custom options
 */
export function createJwtStrategy(secretOrKey: string) {
  @Injectable()
  class JwtStrategy extends BaseJwtStrategy {
    constructor() {
      super({ secretOrKey });
    }
  }
  return JwtStrategy;
}
