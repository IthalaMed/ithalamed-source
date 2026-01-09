import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseError } from '@ithalamed/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status:  number;
    let message: string;
    let code: string;
    let errors: unknown;

    if (exception instanceof BaseError) {
      // Custom application errors
      status = exception.statusCode;
      message = exception. message;
      code = exception. code;
      errors = exception. details;
    } else if (exception instanceof HttpException) {
      // NestJS HTTP exceptions
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj. message as string) || exception.message;
        errors = responseObj.errors;
      } else {
        message = exceptionResponse as string;
      }
      code = `HTTP_${status}`;
    } else if (exception instanceof Error) {
      // Generic errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'An unexpected error occurred';
      code = 'INTERNAL_ERROR';
      
      // Log the actual error
      this.logger.error(
        `Unhandled exception:  ${exception.message}`,
        exception.stack,
      );
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'An unexpected error occurred';
      code = 'INTERNAL_ERROR';
    }

    const errorResponse = {
      success: false,
      error: {
        code,
        message,
        statusCode: status,
        errors,
      },
      meta: {
        requestId: request.headers['x-request-id'] || this.generateRequestId(),
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      },
    };

    response. status(status).json(errorResponse);
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
