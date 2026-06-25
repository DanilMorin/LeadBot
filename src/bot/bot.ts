import { logger } from '../utils/logger';
import { Telegraf } from 'telegraf-hardened';
import { env } from '../config/env';
import { registerStartCommand } from './commands/start.command';
import { registerAdminCommand } from './commands/admin.command';
import { registerCancelCommand } from './commands/cancel.command';
import { registerExportCommand } from './commands/export.command';
import { registerNewLeadsCommand } from './commands/new-leads.command';
import { registerLeadFlow } from './handlers/lead-flow.handler';
import { registerStatusCallbacks } from './handlers/status-callback.handler';

export function createBot() {
  const botOptions = env.telegramProxyUrl
    ? {
        telegram: {
          proxy: {
            proxy: env.telegramProxyUrl,
            FetchClient: loadTelegramFetchClient(),
          },
        },
      }
    : undefined;

  const bot = new Telegraf(env.botToken, botOptions);

  registerStartCommand(bot);
  registerAdminCommand(bot);
  registerNewLeadsCommand(bot);
  registerExportCommand(bot);
  registerCancelCommand(bot);
  registerLeadFlow(bot);
  registerStatusCallbacks(bot);

  bot.catch((error, ctx) => {
    logger.error(`Bot error for update ${ctx.update.update_id}`, error);
  });

  return bot;
}

function loadTelegramFetchClient() {
  try {
    const { FetchClient } = require('@telegraf-hardened/fetch');

    return FetchClient;
  } catch {
    throw new Error(
      'TELEGRAM_PROXY_URL requires @telegraf-hardened/fetch. Install it with: npm install @telegraf-hardened/fetch'
    );
  }
}
