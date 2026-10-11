import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Request } from 'express';

export interface StandardSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, StandardSuccessResponse<T> | T>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardSuccessResponse<T> | T> {
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
