import { Telegraf } from 'telegraf-hardened';
import { mainKeyboard } from '../../keyboards/lead.keyboard';
import { leadDrafts } from '../../types/session.types';

export function registerCancelCommand(bot: Telegraf): void {
  bot.command('cancel', async (ctx) => {
    if (!ctx.from) {
      return;
    }

    const hasDraft = leadDrafts.has(ctx.from.id);  //LeadDrafts временное хранилище заявок

    if (!hasDraft) {
      await ctx.reply('У вас нет активной заявки.', mainKeyboard());
      return;
    }

    leadDrafts.delete(ctx.from.id);

    await ctx.reply(
      'Заявка отменена. Чтобы начать заново, нажмите «Оставить заявку».',
      mainKeyboard(),
    );
  });

  bot.hears('Отменить', async (ctx) => {
    if (!ctx.from) {
      return;
    }

    const hasDraft = leadDrafts.delete(ctx.from.id);

    await ctx.reply(
      hasDraft ? 'Заявка отменена.' : 'У вас нет активной заявки.',
      mainKeyboard(),
    );
  });
}
