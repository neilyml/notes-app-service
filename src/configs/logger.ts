import pino from 'pino';
import { isProduction, environment } from './environment';

const transport = isProduction
  ? undefined
  : {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        singleLine: true,
      },
    };

export const logger = pino({
  level: environment.LOG_LEVEL,
  redact: ['req.headers.authorization', 'req.headers.cookie', '*.password'],
  transport,
});
