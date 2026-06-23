import { Telegraf } from 'telegraf-hardened';
import { mainKeyboard } from '../../keyboards/lead.keyboard';

export function registerStartCommand(bot: Telegraf) {
  bot.start(async (ctx) => {
    await ctx.reply(
      [
        'Здравствуйте! Я LeadBot.',
        '',
        'Я помогу быстро оставить заявку.',
        'Нажмите кнопку “Оставить заявку”, и я задам несколько вопросов.',
      ].join('\n'),
      mainKeyboard()
    );
  });
}