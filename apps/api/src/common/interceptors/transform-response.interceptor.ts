import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Request } from 'express';
import { BYPASS_TRANSFORM_KEY } from '../decorators/bypass-transform.decorator.js';

export interface StandardSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, StandardSuccessResponse<T> | T>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardSuccessResponse<T> | T> {
    const isBypassed = this.reflector.getAllAndOverride<boolean>(
      BYPASS_TRANSFORM_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isBypassed) {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest<Request>();
    const url = req?.originalUrl || req?.url || '';

    // Bypass wrapping for Better Auth authentication routes
    if (url.startsWith('/api/auth')) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // If data is already an object with a success boolean, do not double-wrap
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}

