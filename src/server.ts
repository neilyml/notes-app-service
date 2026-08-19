import app from './app';
import { logger } from './configs/logger';

const PORT = process.env.PORT || 8080;

async function startServer(): Promise<void> {
  try {
    app.listen(PORT, () => {
      logger.info(`=> API   http://localhost:${PORT}/api/v1`);
      logger.info(`=> Health    http://localhost:${PORT}/api/v1/health`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
}

startServer();
