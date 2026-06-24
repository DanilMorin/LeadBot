import cors from 'cors';
import express from 'express';
import { apiAuthMiddleware } from './middlewares/api-auth.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { leadsRouter } from './routes/leads.routes';

export function createApiServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
    });
  });

  app.use('/api/leads', apiAuthMiddleware, leadsRouter); //потом ограничю под домен проекта, пока что оставлю для локальной разработки

  app.use(errorMiddleware);

  return app;
}