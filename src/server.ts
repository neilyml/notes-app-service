import app from './app';
import { logger } from './configs/logger';
import { connectDatabase } from './configs/database';
import { environment } from './configs/environment';

const PORT = environment.PORT || 8080;

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

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
