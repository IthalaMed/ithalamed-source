import { SetMetadata } from '@nestjs/common';
import { UserType } from '@ithalamed/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify required roles for a route
 */
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles);
