import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/$/, '');
}

function collectAllowedOrigins(): string[] {
  const fromEnv = [
    process.env.CLIENT_URL,
    process.env.BETTER_AUTH_URL,
    ...(process.env.ALLOWED_ORIGINS || '').split(','),
  ]
    .map((v) => (v ? normalizeOrigin(v) : ''))
    .filter(Boolean);

  return Array.from(
    new Set([
      ...fromEnv,
      'https://aminbabu.com',
      'https://www.aminbabu.com',
      'https://api.aminbabu.com',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://abious.ddev.site',
      'https://abious.ddev.site',
      'http://api.abious.ddev.site',
      'https://api.abious.ddev.site',
    ]),
  );
}

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin;
    const allowedOrigins = collectAllowedOrigins();

    const isAllowed =
      !!origin &&
      (allowedOrigins.includes(normalizeOrigin(origin)) ||
        /\.ddev\.site(:\d+)?$/.test(origin.replace(/^https?:\/\//, '')) ||
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
        /^https?:\/\/([a-z0-9-]+\.)*aminbabu\.com$/.test(origin) ||
        process.env.NODE_ENV !== 'production' ||
        (process.env.ALLOWED_ORIGINS && process.env.ALLOWED_ORIGINS.includes('*')));

    if (origin && isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Vary', 'Origin');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        [
          'Origin',
          'X-Requested-With',
          'Content-Type',
          'Accept',
          'Authorization',
          'x-request-id',
          'x-correlation-id',
          'cookie',
        ].join(', '),
      );
      res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie, x-request-id, x-correlation-id');
    }

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }

    next();
  }
}
