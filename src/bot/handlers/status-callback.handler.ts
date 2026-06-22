import { LeadStatus } from '@prisma/client';
import { Telegraf } from 'telegraf-hardened';
import { leadService } from '../../modules/leads/lead.service';

const statusLabels: Record<LeadStatus, string> = {
  NEW: 'новая',
  IN_PROGRESS: 'в работе',
  CLOSED: 'закрыта',
};

export function registerStatusCallbacks(bot: Telegraf) {
  bot.action(/^lead:(\d+):(NEW|IN_PROGRESS|CLOSED)$/, async (ctx) => {
    const [, id, status] = ctx.match;

    const lead = await leadService.updateStatus(Number(id), status as LeadStatus);

    await ctx.answerCbQuery(`Статус изменён: ${statusLabels[lead.status]}`);

    await ctx.editMessageText(
      [
        `Заявка #${lead.id}`,
        '',
        `Имя: ${lead.name}`,
        `Телефон: ${lead.phone}`,
        `Услуга: ${lead.service}`,
        `Комментарий: ${lead.comment || '—'}`,
        '',
        `Статус: ${statusLabels[lead.status]}`,
      ].join('\n')
    );
  });
}