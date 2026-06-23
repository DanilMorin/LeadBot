import { Input } from 'telegraf-hardened';
import { Telegraf } from 'telegraf-hardened';
import { leadService } from '../../modules/leads/lead.service';
import { isAdminChat } from '../../utils/admin';
import { leadsToCsv } from '../../utils/csv';

export function registerExportCommand(bot: Telegraf) {
  bot.command('export', async (ctx) => {
    if (!ctx.chat || !isAdminChat(ctx.chat.id)) {
      await ctx.reply('У вас нет доступа к этой команде.');
      return;
    }

    const leads = await leadService.getLastLeads(100);

    if (!leads.length) {
      await ctx.reply('Заявок пока нет.');
      return;
    }

    const csv = leadsToCsv(leads);
    const buffer = Buffer.from('\uFEFF' + csv, 'utf-8');

    await ctx.replyWithDocument(
      Input.fromBuffer(buffer, 'leads.csv'),
      {
        caption: 'Экспорт заявок',
      }
    );
  });
}
