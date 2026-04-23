import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import LokiTransport from 'winston-loki';

export const winstonConfig: winston.LoggerOptions = {
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('TaskMngr', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),

    new LokiTransport({
      host: process.env.GRAFANA_LOKI_URL!,
      basicAuth: `${process.env.GRAFANA_LOKI_USER!}:${process.env.GRAFANA_LOKI_TOKEN!}`,
      labels: { job: 'nestjs-app' },
      json: true,
      batching: false,
      replaceTimestamp: true,
      onConnectionError: (err) => {
        console.log('--- LOKI DEBUG START ---');
        console.error(err);
        console.log('--- LOKI DEBUG END ---');
      },
    }),
  ],
};
