import { Telegraf } from 'telegraf-hardened';
import { env } from '../../config/env';
import { leadService } from '../../modules/leads/lead.service';

function isAdmin(chatId: number | string): boolean {
  return String(chatId) === String(env.adminChatId);
}

export function registerAdminCommand(bot: Telegraf) {
  bot.command('leads', async (ctx) => {
    if (!ctx.chat || !isAdmin(ctx.chat.id)) {
      await ctx.reply('У вас нет доступа к этой команде.');
      return;
    }

    const leads = await leadService.getLastLeads(10);

    if (!leads.length) {
      await ctx.reply('Заявок пока нет.');
      return;
    }

    const message = leads
      .map((lead) => {
        return [
          `#${lead.id} — ${lead.status}`,
          `Имя: ${lead.name}`,
          `Телефон: ${lead.phone}`,
          `Услуга: ${lead.service}`,
        ].join('\n');
      })
      .join('\n\n');

    await ctx.reply(message);
  });
}