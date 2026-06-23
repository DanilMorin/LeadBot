import { Markup } from 'telegraf-hardened';

export function mainKeyboard() {
  return Markup.keyboard([['Оставить заявку']]).resize().persistent();
}

export function leadFlowKeyboard() {
  return Markup.keyboard([['Отменить']]).resize().persistent();
}

export function leadStatusKeyboard(leadId: number) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('В работу', `lead:${leadId}:IN_PROGRESS`),
      Markup.button.callback('Закрыть', `lead:${leadId}:CLOSED`),
    ],
  ]);
}
