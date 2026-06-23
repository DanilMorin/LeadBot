/*Приводим сообщения к определённому формату */
import { Lead, LeadStatus } from '@prisma/client';

export const leadStatusLabels: Record<LeadStatus, string> = {
  NEW: 'новая',
  IN_PROGRESS: 'в работе',
  CLOSED: 'закрыта',
};

export function formatLeadMessage(lead: Lead): string {
  return [
    `Заявка #${lead.id}`,
    '',
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    `Услуга: ${lead.service}`,
    `Комментарий: ${lead.comment || '—'}`,
    '',
    `Статус: ${leadStatusLabels[lead.status]}`,
    `Создана: ${lead.createdAt.toLocaleString('ru-RU')}`,
  ].join('\n');
}

export function formatLeadShort(lead: Lead): string {
  return [
    `#${lead.id} — ${leadStatusLabels[lead.status]}`,
    `${lead.name} / ${lead.phone}`,
    `Услуга: ${lead.service}`,
  ].join('\n');
}