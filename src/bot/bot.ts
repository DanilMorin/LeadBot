import { Telegraf } from 'telegraf-hardened';
import { env } from '../config/env';
import { registerStartCommand } from './commands/start.command';
import { registerAdminCommand } from './commands/admin.command';
import { registerLeadFlow } from './handlers/lead-flow.handler';
import { registerStatusCallbacks } from './handlers/status-callback.handler';

export function createBot() {
  const bot = new Telegraf(env.botToken);

  registerStartCommand(bot);
  registerAdminCommand(bot);
  registerLeadFlow(bot);
  registerStatusCallbacks(bot);

  bot.catch((error, ctx) => {
    console.error(`Telegram update ${ctx.update.update_id} failed:`, error);
  });

  return bot;
}
