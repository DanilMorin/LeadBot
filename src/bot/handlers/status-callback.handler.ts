import { LeadStatus } from '@prisma/client';
import { Telegraf } from 'telegraf-hardened';
import { formatLeadMessage, leadStatusLabels } from '../../modules/leads/lead.formatter';
import { leadService } from '../../modules/leads/lead.service';
import { leadStatusKeyboard } from '../../keyboards/lead.keyboard';

export function registerStatusCallbacks(bot: Telegraf) {
  bot.action(/^lead:(\d+):(NEW|IN_PROGRESS|CLOSED)$/, async (ctx) => {
    const [, id, status] = ctx.match;

    const lead = await leadService.updateStatus(Number(id), status as LeadStatus);

    await ctx.answerCbQuery(`Статус изменён: ${leadStatusLabels[lead.status]}`);

    await ctx.editMessageText(formatLeadMessage(lead), leadStatusKeyboard(lead.id));
  });
}