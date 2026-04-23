import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import LokiTransport from 'winston-loki';

const removeNullStack = winston.format((info) => {
  console.log('removeNullStack: ', info);
  if (info.stack && Array.isArray(info.stack) && !info.stack[0]) {
    delete info.stack;
  }
  return info;
});

export const winstonConfig: winston.LoggerOptions = {
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    removeNullStack(),
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
      replaceTimestamp: false,
      onConnectionError: (err) => {
        console.log('--- LOKI DEBUG START ---');
        console.error(err);
        console.log('--- LOKI DEBUG END ---');
      },
    }),
  ],
};
