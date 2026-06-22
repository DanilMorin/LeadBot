import { createBot } from './bot/bot';
import { createApiServer } from './api/server';
import { env } from './config/env';

async function bootstrap() {
  const bot = createBot();

  await bot.validateTokenAsync();

  const api = createApiServer();

  api.listen(env.apiPort, () => {
    console.log(`API server started on port ${env.apiPort}`);
  });

  bot.launch(
    {
      polling: {
        retryOnConflict: true,
        maxRetryDelay: 30000,
      },
    },
    () => console.log('LeadBot started')
  ).catch((error) => {
    console.error('Telegram polling error:', error);
    process.exitCode = 1;
  });

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

bootstrap().catch((error) => {
  console.error('Application start error:', error);
  process.exit(1);
});
