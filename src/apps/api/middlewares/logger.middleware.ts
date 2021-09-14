import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LogService } from '@common/log.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logService: LogService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    try {
      if (req.baseUrl !== '/') {
        this.logService.info({
          data: {
            method: req.method,
            path: req.baseUrl,
            query: req.query,
            body: req.body,
          },
          message: 'Request',
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  }
}
