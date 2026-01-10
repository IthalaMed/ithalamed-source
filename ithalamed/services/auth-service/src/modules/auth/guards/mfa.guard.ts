import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const REQUIRE_MFA_KEY = 'requireMfa';

@Injectable()
export class MfaGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context:  ExecutionContext): boolean {
    const requireMfa = this.reflector. getAllAndOverride<boolean>(REQUIRE_MFA_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireMfa) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const session = request.session;

    if (!session?. mfaVerified) {
      throw new ForbiddenException('MFA verification required for this action');
    }

    return true;
  }
}
