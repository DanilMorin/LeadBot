import cors from 'cors';
import express from 'express';
import path from 'path';
import { errorMiddleware } from './middlewares/error.middleware';
import { leadsRouter } from './routes/leads.routes';

export function createApiServer() {
  const app = express();
  const webRoot = path.resolve(process.cwd(), 'web');

  app.set('json replacer', (_key: string, value: unknown) =>
    typeof value === 'bigint' ? value.toString() : value
  );

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
    });
  });

  app.use('/api/leads', leadsRouter);
  app.get('/', (_req, res) => {
    res.sendFile(path.join(webRoot, 'index.html'));
  });
  app.use(express.static(webRoot));

  app.use(errorMiddleware);

  return app;
}
