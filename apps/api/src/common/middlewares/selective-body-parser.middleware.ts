import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import express from 'express';

@Injectable()
export class SelectiveBodyParserMiddleware implements NestMiddleware {
  private jsonParser = express.json({ limit: '10mb' });
  private urlEncodedParser = express.urlencoded({ extended: true, limit: '10mb' });

  use(req: Request, res: Response, next: NextFunction) {
    const url = req.originalUrl || req.url || '';
    if (url.startsWith('/api/auth')) {
      return next();
    }
    this.jsonParser(req, res, (err) => {
      if (err) return next(err);
      this.urlEncodedParser(req, res, next);
    });
  }
}
