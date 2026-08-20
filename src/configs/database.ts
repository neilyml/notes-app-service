import mongoose from 'mongoose';
import { environment } from './environment';
import { logger } from './logger';

export async function connectDatabase(): Promise<void> {
  mongoose.connection.on('connected', () => logger.info('database connected'));
  mongoose.connection.on('disconnected', () => logger.warn('database disconnected'));
  mongoose.connection.on('error', (err) => logger.error({ err }, 'database connection error'));

  await mongoose.connect(environment.MONGODB_URI, {
    serverSelectionTimeoutMS: 10_000,
  });
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
