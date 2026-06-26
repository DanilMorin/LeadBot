import { Markup } from 'telegraf-hardened';
import { env } from '../config/env';

export function mainKeyboard() {
  return Markup.keyboard([
    ['Оставить заявку'],
    [
      Markup.button.webApp('Открыть дашборд', env.webAppUrl),
    ],
    ['Отменить'],
  ]).resize();
}

export function leadStatusKeyboard(leadId: number) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('В работу', `lead:${leadId}:IN_PROGRESS`),
      Markup.button.callback('Закрыть', `lead:${leadId}:CLOSED`),
    ],
  ]);
}