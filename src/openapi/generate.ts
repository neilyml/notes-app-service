import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

async function generateOpenApi(): Promise<void> {
  const { registerApiPaths } = await import('./routes.js');
  const registry = new OpenAPIRegistry();

  registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });
  registerApiPaths(registry);

  const generator = new OpenApiGeneratorV3(registry.definitions);
  const document = generator.generateDocument({
    openapi: '3.0.3',
    info: {
      title: 'Secure Notes API',
      version: '1.0.0',
    },
  });

  const outputPath = resolve(process.cwd(), 'openapi.json');
  writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`);

  console.log(`Generated ${outputPath}`);
}

void generateOpenApi();
