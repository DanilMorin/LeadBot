import { Telegraf } from 'telegraf-hardened';
import { formatLeadShort } from '../../modules/leads/lead.formatter';
import { leadService } from '../../modules/leads/lead.service';
import { isAdminChat } from '../../utils/admin';

export function registerAdminCommand(bot: Telegraf) {
  bot.command('leads', async (ctx) => {
    if (!ctx.chat || !isAdminChat(ctx.chat.id)) {
      await ctx.reply('У вас нет доступа к этой команде.');
      return;
    }

    const leads = await leadService.getLastLeads(10);

    if (!leads.length) {
      await ctx.reply('Заявок пока нет.');
      return;
    }

    const message = leads.map(formatLeadShort).join('\n\n');

    await ctx.reply(message);
  });

  bot.command('id', async (ctx) => {
    await ctx.reply(`Ваш chat_id: ${ctx.chat.id}`);
  });
}