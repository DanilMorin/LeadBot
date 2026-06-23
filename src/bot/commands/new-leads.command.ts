import { LeadStatus } from '@prisma/client';
import { Telegraf } from 'telegraf-hardened';
import { formatLeadShort } from '../../modules/leads/lead.formatter';
import { leadService } from '../../modules/leads/lead.service';
import { isAdminChat } from '../../utils/admin';

export function registerNewLeadsCommand(bot: Telegraf) {
  bot.command('newleads', async (ctx) => {
    if (!ctx.chat || !isAdminChat(ctx.chat.id)) {
      await ctx.reply('У вас нет доступа к этой команде.');
      return;
    }

    const leads = await leadService.getLeadsByStatus(LeadStatus.NEW, 10);

    if (!leads.length) {
      await ctx.reply('Новых заявок нет.');
      return;
    }

    const message = leads.map(formatLeadShort).join('\n\n');

    await ctx.reply(message);
  });
}