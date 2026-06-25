import { createApiServer } from './api/server';
import { createBot } from './bot/bot';
import { env } from './config/env';
import { logger } from './utils/logger';

async function bootstrap() {
  const api = createApiServer();

  api.listen(env.apiPort, () => {
    logger.info(`API server started on port ${env.apiPort}`);
  });

  logger.info('LeadBot API started');

  if (!env.botEnabled) {
    logger.info('Telegram bot disabled by BOT_ENABLED=false');
    return;
  }

  try {
    const bot = createBot();

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));

    await bot.validateTokenAsync();

    await bot.launch({
      polling: {
        retryOnConflict: true,
        maxRetryDelay: 30000,
      },
    });
  } catch (error) {
    logger.error('Telegram bot start error:', error);
  }
}

bootstrap().catch((error) => {
  logger.error('Application start error:', error);
  process.exit(1);
});
