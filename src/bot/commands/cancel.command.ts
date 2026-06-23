import { Telegraf } from 'telegraf-hardened';
import { leadDrafts } from '../../types/session.types';
/* заявки, которые пользователь ещё не закончил */

export function registerCancelCommand(bot: Telegraf) {
  bot.command('cancel', async (ctx) => {
    if (!ctx.from) {
      return;
    }

    const hasDraft = leadDrafts.has(ctx.from.id);  //LeadDrafts временное хранилище заявок

    if (!hasDraft) {
      await ctx.reply('У вас нет активной заявки.');
      return;
    }

    leadDrafts.delete(ctx.from.id);

    await ctx.reply('Заявка отменена. Чтобы начать заново, нажмите “Оставить заявку”.');
  });

  bot.hears('Отменить', async (ctx) => {
    if (!ctx.from) {
      return;
    }

    leadDrafts.delete(ctx.from.id);

    await ctx.reply('Заявка отменена.');
  });
}