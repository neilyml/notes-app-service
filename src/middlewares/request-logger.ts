import pinoHttp from 'pino-http';
import { logger } from '../configs/logger';

export const customPinoHttpLogger = pinoHttp({
  logger,
  serializers: {
    req: (req) => ({ id: req.id, method: req.method, url: req.url }),
    res: (res) => ({ statusCode: res.statusCode }),
  },
});
