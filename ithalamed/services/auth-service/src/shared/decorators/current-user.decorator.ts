import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface CurrentUserData {
  userId: string;
  email: string;
  userType:  string;
  sessionId: string;
}

/**
 * Decorator to extract current user from request
 */
export const CurrentUser = createParamDecorator(
  (data:  keyof CurrentUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx. switchToHttp().getRequest<Request>();
    const user = request.user as CurrentUserData;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
