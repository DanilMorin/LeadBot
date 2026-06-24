/*
 *Роуты для работы с заявками
 */
import { Request, Response, NextFunction } from 'express';
import { LeadStatus } from '@prisma/client';
import { Router } from 'express';
import { LEAD_LIMITS } from '../../modules/leads/lead.constants';
import { leadService } from '../../modules/leads/lead.service';
import { HttpError } from '../../utils/http-error';

export const leadsRouter = Router();

function parseLeadStatus(value: unknown): LeadStatus | undefined { //парсим статус заявки из запроса
  if (!value) {
    return undefined;
  }

  if (
    value === LeadStatus.NEW ||
    value === LeadStatus.IN_PROGRESS ||
    value === LeadStatus.CLOSED
  ) {
    return value;
  }

  throw new HttpError(400, 'Некорректный статус заявки');
}

function parseLimit(value: unknown): number { //парсим лимит заявок из запроса
  if (!value) {
    return LEAD_LIMITS.defaultList;
  }

  const limit = Number(value);

  if (
    Number.isNaN(limit) ||
    limit < LEAD_LIMITS.minList ||
    limit > LEAD_LIMITS.maxList
  ) {
    throw new HttpError(400, 'Некорректный limit');
  }

  return limit;
}

leadsRouter.get('/', async (req, res, next) => { //получение списка заявок с фильтрацией по статусу и лимитом
  try {
    const status = parseLeadStatus(req.query.status);
    const limit = parseLimit(req.query.limit);

    const leads = await leadService.getLeads({
      status,
      limit,
    });

    res.json({
      data: leads,
    });
  } catch (error) {
    next(error);
  }
});

leadsRouter.get('/stats', async (_req, res, next) => { //получение статистики по заявкам
  try {
    const stats = await leadService.getStats();

    res.json({
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

leadsRouter.get('/:id', async (req, res, next) => { // получение одной заявки по ID
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new HttpError(400, 'Некорректный ID заявки');
    }

    const lead = await leadService.getLeadById(id);

    res.json({
      data: lead,
    });
  } catch (error) {
    next(error);
  }
});

leadsRouter.patch('/:id/status', async (req, res, next) => { //обновление статуса заявки по ID
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new HttpError(400, 'Некорректный ID заявки');
    }

    const status = parseLeadStatus(req.body.status);

    if (!status) {
      throw new HttpError(400, 'Статус обязателен');
    }

    const lead = await leadService.updateStatus(id, status);

    res.json({
      data: lead,
    });
  } catch (error) {
    next(error);
  }
});
