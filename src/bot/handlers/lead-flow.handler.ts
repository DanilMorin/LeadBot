/*
 * Регистрирует Telegram-обработчики сценария заявки и управляет переходами между его шагами.
 * Проверка введённых значений делегирована валидаторам, а сохранение заявки — leadService.
 */

import { Context, Telegraf } from 'telegraf-hardened';
import { message } from 'telegraf-hardened/filters';
import { env } from '../../config/env';
import { leadStatusKeyboard } from '../../keyboards/lead.keyboard';
import { formatLeadMessage } from '../../modules/leads/lead.formatter';
import { leadService } from '../../modules/leads/lead.service';
import { isValidName, isValidPhone, isValidService, } from '../../modules/leads/lead.validator';
import { LeadDraft, leadDrafts } from '../../types/session.types';

async function startLeadFlow(ctx: Context): Promise<void> {
  if (!ctx.from) {
    return;
  }

  leadDrafts.set(ctx.from.id, { step: 'name' });
  await ctx.reply('Как вас зовут?');
}

async function handleNameStep(
  ctx: Context,
  draft: LeadDraft,
  name: string,
): Promise<void> {
  if (!isValidName(name)) {
    await ctx.reply('Имя должно содержать от 2 до 100 символов. Попробуйте ещё раз:');
    return;
  }

  draft.name = name;
  draft.step = 'phone';
  await ctx.reply('Введите ваш телефон:');
}

async function handlePhoneStep(
  ctx: Context,
  draft: LeadDraft,
  phone: string,
): Promise<void> {
  if (!isValidPhone(phone)) {
    await ctx.reply('Похоже, телефон введён некорректно. Попробуйте ещё раз:');
    return;
  }

  draft.phone = phone;
  draft.step = 'service';
  await ctx.reply('Какая услуга вас интересует?');
}

async function handleServiceStep(
  ctx: Context,
  draft: LeadDraft,
  service: string,
): Promise<void> {
  if (!isValidService(service)) {
    await ctx.reply('Название услуги должно содержать от 2 до 200 символов. Попробуйте ещё раз:');
    return;
  }

  draft.service = service;
  draft.step = 'comment';
  await ctx.reply('Добавьте комментарий. Если комментария нет, напишите "-"');
}

async function handleCommentStep(
  ctx: Context,
  draft: LeadDraft,
  comment: string,
  userId: number,
): Promise<void> {
  if (!draft.name || !draft.phone || !draft.service) {
    leadDrafts.delete(userId);
    await ctx.reply('Не удалось завершить заявку. Пожалуйста, начните заполнение заново.');
    return;
  }

  const lead = await leadService.createLead({
    telegramId: userId,
    name: draft.name,
    phone: draft.phone,
    service: draft.service,
    comment: comment === '-' ? undefined : comment,
  });

  leadDrafts.delete(userId);
  await ctx.reply('Спасибо! Ваша заявка принята.');

  await ctx.telegram.sendMessage(
    env.adminChatId,
    `Новая заявка\n\n${formatLeadMessage(lead)}`,
    leadStatusKeyboard(lead.id),
  );
}

async function handleLeadText(ctx: Context): Promise<void> {
  if (!ctx.from || !ctx.message || !('text' in ctx.message)) {
    return;
  }

  const userId = ctx.from.id;
  const draft = leadDrafts.get(userId);

  if (!draft) {
    return;
  }

  const text = ctx.message.text.trim();

  switch (draft.step) {
    case 'name':
      await handleNameStep(ctx, draft, text);
      return;
    case 'phone':
      await handlePhoneStep(ctx, draft, text);
      return;
    case 'service':
      await handleServiceStep(ctx, draft, text);
      return;
    case 'comment':
      await handleCommentStep(ctx, draft, text, userId);
  }
}

export function registerLeadFlow(bot: Telegraf): void {
  bot.hears('Оставить заявку', startLeadFlow);
  bot.on(message('text'), handleLeadText);
}
