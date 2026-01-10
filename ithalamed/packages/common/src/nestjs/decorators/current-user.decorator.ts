import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract the current authenticated user from the request
 * 
 * @example
 * // Get entire user object
 * @Get('profile')
 * getProfile(@CurrentUser() user: AuthenticatedUser) { ... }
 * 
 * @example
 * // Get specific property
 * @Get('profile')
 * getProfile(@CurrentUser('id') userId: string) { ... }
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (! user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
