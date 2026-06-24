import { createApiServer } from './api/server';
import { createBot } from './bot/bot';
import { env } from './config/env';
import { logger } from './utils/logger';

async function bootstrap() {
  const bot = createBot();

  await bot.validateTokenAsync();

  const api = createApiServer();

  api.listen(env.apiPort, () => {
    logger.info(`API server started on port ${env.apiPort}`);
  });

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  logger.info('LeadBot started');

  await bot.launch({
    polling: {
      retryOnConflict: true,
      maxRetryDelay: 30000,
    },
  });
}

bootstrap().catch((error) => {
  logger.error('Application start error:', error);
  process.exit(1);
});
