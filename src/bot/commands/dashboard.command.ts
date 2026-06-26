import { Markup, Telegraf } from 'telegraf-hardened';
import { env } from '../../config/env';
import { isAdminChat } from '../../utils/admin';

export function registerDashboardCommand(bot: Telegraf) {
  bot.command('dashboard', async (ctx) => {
    if (!ctx.chat || !isAdminChat(ctx.chat.id)) {
      await ctx.reply('У вас нет доступа к dashboard.');
      return;
    }

    await ctx.reply(
      'Откройте dashboard LeadBot:',
      Markup.inlineKeyboard([
        [
          Markup.button.webApp('Открыть dashboard', env.webAppUrl),
        ],
      ])
    );
  });
}