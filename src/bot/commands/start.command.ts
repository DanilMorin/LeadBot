import { Markup, Telegraf } from 'telegraf-hardened';

export function registerStartCommand(bot: Telegraf) {
  bot.start(async (ctx) => {
    await ctx.reply(
      'Здравствуйте! Я LeadBot. Помогу быстро оставить заявку.',
      Markup.keyboard([['Оставить заявку']]).resize()
    );
  });
}