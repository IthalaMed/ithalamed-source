import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error?: string;
  errors?: string[];
  timestamp: string;
  path: string;
  requestId?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    let errors: string[] = [];

    if (exception instanceof HttpException) {
      status = exception. getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj. message as string) || message;
        error = (responseObj.error as string) || error;

        if (Array.isArray(responseObj.message)) {
          errors = responseObj.message;
          message = 'Validation failed';
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Unhandled exception:  ${exception.message}`,
        exception.stack,
      );
    }

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: status,
      message,
      error:  status >= 500 ? error : undefined,
      errors:  errors. length > 0 ? errors :  undefined,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: request.headers['x-request-id'] as string | undefined,
    };

    // Log error details
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${message}`,
        {
          body: request.body,
          params: request.params,
          query: request.query,
          user: (request as any).user?.id,
        },
      );
    } else {
      this.logger. warn(
        `${request.method} ${request.url} - ${status} - ${message}`,
      );
    }

    response.status(status).json(errorResponse);
  }
}
