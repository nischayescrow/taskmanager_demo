import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import LokiTransport from 'winston-loki';

export const winstonConfig: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('TaskMngr', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),

    // File transport - all logs
    new winston.transports.File({
      filename: 'logs/app.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),

    // Direct push to Grafana Cloud Loki
    new LokiTransport({
      host: process.env.GRAFANA_LOKI_URL!,
      basicAuth: `${process.env.GRAFANA_LOKI_USER!}:${process.env.GRAFANA_LOKI_TOKEN!}`, // UserID:Token
      labels: { job: 'nestjs-app' },
      json: true,
      format: winston.format.json(),
      replaceTimestamp: true,
      onConnectionError: (err) => console.error('Loki Connection Error:', err),
    }),
  ],
};
