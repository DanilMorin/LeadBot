import express from 'express';

export function createApiServer() {
  const app = express();

  app.use(express.json());

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  return app;
}
