import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    globalSetup: ['./tests/setup/mongo-init.ts'],
    setupFiles: ['./tests/setup/db.ts'],
    fileParallelism: false,
  },
});
