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
  const bot = new Telegraf(env.botToken);

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
