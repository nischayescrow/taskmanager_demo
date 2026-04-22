import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class PrometheusMiddleware implements NestMiddleware {
  constructor(
    @InjectMetric('nestjs_http_requests_total')
    private readonly reqCounter: Counter<string>,
    @InjectMetric('nestjs_http_request_duration_seconds')
    private readonly histogram: Histogram<string>,
    @InjectMetric('nestjs_http_errors')
    private readonly errCounter: Counter<string>,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      if (req.originalUrl !== '/metrics') {
        const duration = (Date.now() - start) / 1000;

        this.reqCounter.inc({
          method: req.method,
          route: req.route?.path || req.path,
          status: res.statusCode.toString(),
        });

        if (res.statusCode >= 300) {
          this.errCounter.inc({
            status: res.statusCode.toString(),
          });
        }

        this.histogram.observe(
          { method: req.method, route: req.route?.path || req.path },
          duration,
        );
      }
    });

    next();
  }
}
