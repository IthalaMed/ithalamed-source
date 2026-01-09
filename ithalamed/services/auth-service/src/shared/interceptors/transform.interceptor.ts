import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  data:  T;
  message?: string;
  meta:  {
    requestId:  string;
    timestamp: string;
  };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId =
      (request.headers['x-request-id'] as string) ||
      `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return next.handle().pipe(
      map((data) => {
        // If data already has the response structure, return as is
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        return {
          success: true,
          data,
          meta: {
            requestId,
            timestamp: new Date().toISOString(),
          },
        };
      }),
    );
  }
}
