import { Lead } from '@prisma/client';
import { leadStatusLabels } from '../modules/leads/lead.formatter';

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value).replace(/"/g, '""');

  return `"${stringValue}"`;
}

export function leadsToCsv(leads: Lead[]): string {
  const headers = [
    'ID',
    'Имя',
    'Телефон',
    'Услуга',
    'Комментарий',
    'Статус',
    'Создана',
  ];

  const rows = leads.map((lead) => [
    lead.id,
    lead.name,
    lead.phone,
    lead.service,
    lead.comment || '',
    leadStatusLabels[lead.status],
    lead.createdAt.toLocaleString('ru-RU'),
  ]);

  return [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(';'))
    .join('\n');
}