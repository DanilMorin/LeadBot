import { createApiServer } from './api/server';
import { createBot } from './bot/bot';
import { env } from './config/env';
import { logger } from './utils/logger';

async function bootstrap() {
  const bot = createBot();

  await bot.validateTokenAsync();

  await bot.launch({
    polling: {
      retryOnConflict: true,
      maxRetryDelay: 30000,
    },
  });

  const api = createApiServer();

  api.listen(env.apiPort, () => {
    logger.info(`API server started on port ${env.apiPort}`);
  });

  logger.info('LeadBot started');

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

bootstrap().catch((error) => {
  logger.error('Application start error:', error);
  process.exit(1);
});