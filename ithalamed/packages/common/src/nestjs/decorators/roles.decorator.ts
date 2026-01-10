import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../enums';

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify required roles for an endpoint
 * 
 * @example
 * @Roles(UserType.ADMIN, UserType.PROVIDER)
 * @Get('admin-data')
 * getAdminData() { ... }
 */
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles);
