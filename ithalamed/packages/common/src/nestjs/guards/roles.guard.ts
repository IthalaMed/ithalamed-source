import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '../../enums';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Role-based Access Control Guard
 * 
 * Checks if the authenticated user has one of the required roles
 * specified by the @Roles() decorator.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector:  Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (! requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Access denied:  No user found');
    }

    const hasRole = requiredRoles.some((role) => user.userType === role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied: Required role(s): ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
