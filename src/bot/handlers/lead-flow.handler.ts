import { Markup, Telegraf } from 'telegraf-hardened';
import { message } from 'telegraf-hardened/filters';
import { env } from '../../config/env';
import { leadService } from '../../modules/leads/lead.service';
import { leadDrafts } from '../../types/session.types';

function isValidPhone(phone: string): boolean {
  return /^[\d\s()+-]{7,20}$/.test(phone);
}

export function registerLeadFlow(bot: Telegraf) {
  bot.hears('Оставить заявку', async (ctx) => {
    if (!ctx.from) {
      return;
    }

    leadDrafts.set(ctx.from.id, {
      step: 'name',
    });

    await ctx.reply('Как вас зовут?');
  });

  bot.on(message('text'), async (ctx) => {
    const userId = ctx.from.id;
    const text = ctx.message.text.trim();

    const draft = leadDrafts.get(userId);

    if (!draft) {
      return;
    }

    if (draft.step === 'name') {
      draft.name = text;
      draft.step = 'phone';

      await ctx.reply('Введите ваш телефон:');
      return;
    }

    if (draft.step === 'phone') {
      if (!isValidPhone(text)) {
        await ctx.reply('Похоже, телефон введён некорректно. Попробуйте ещё раз:');
        return;
      }

      draft.phone = text;
      draft.step = 'service';

      await ctx.reply('Какая услуга вас интересует?');
      return;
    }

    if (draft.step === 'service') {
      draft.service = text;
      draft.step = 'comment';

      await ctx.reply('Добавьте комментарий. Если комментария нет, напишите "-"');
      return;
    }

    if (draft.step === 'comment') {
      draft.comment = text === '-' ? undefined : text;

      const lead = await leadService.createLead({
        telegramId: userId,
        name: draft.name!,
        phone: draft.phone!,
        service: draft.service!,
        comment: draft.comment,
      });

      leadDrafts.delete(userId);

      await ctx.reply('Спасибо! Ваша заявка принята.');

      await ctx.telegram.sendMessage(
        env.adminChatId,
        [
          `Новая заявка #${lead.id}`,
          '',
          `Имя: ${lead.name}`,
          `Телефон: ${lead.phone}`,
          `Услуга: ${lead.service}`,
          `Комментарий: ${lead.comment || '—'}`,
          '',
          `Статус: новая`,
        ].join('\n'),
        Markup.inlineKeyboard([
          [
            Markup.button.callback('В работу', `lead:${lead.id}:IN_PROGRESS`),
            Markup.button.callback('Закрыть', `lead:${lead.id}:CLOSED`),
          ],
        ])
      );
    }
  });
}
