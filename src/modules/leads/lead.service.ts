/*`* сервис для взаимодействия с таблицей lead */

import { LeadStatus } from '@prisma/client';
import { prisma } from '../../database/prisma';
import { HttpError } from '../../utils/http-error';
import { LEAD_LIMITS } from './lead.constants';

type CreateLeadData = { //Создание новой заявки в БД
  telegramId?: number;
  name: string;
  phone: string;
  service: string;
  comment?: string;
};

type GetLeadsParams = {
  status?: LeadStatus;
  limit?: number;
};

export class LeadService {
  async createLead(data: CreateLeadData) {
    return prisma.lead.create({
      data: {
        telegramId: data.telegramId ? BigInt(data.telegramId) : null,
        name: data.name,
        phone: data.phone,
        service: data.service,
        comment: data.comment,
      },
    });
  }

  async getLastLeads(limit: number = LEAD_LIMITS.defaultRecent) { //Получение последних заявок без фильтрации по статусу
    return prisma.lead.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async getLeads(params: GetLeadsParams = {}) { //Получение заявок с фильтрацией
    const limit = params.limit ?? LEAD_LIMITS.defaultList;

    return prisma.lead.findMany({
      where: params.status
        ? {
            status: params.status,
          }
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async getLeadsByStatus(status: LeadStatus, limit: number = LEAD_LIMITS.defaultRecent) { //Получение заявок по статусу
    return prisma.lead.findMany({
      where: {
        status,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async getLeadById(id: number) { //Получение одной заявки по ID
    const lead = await prisma.lead.findUnique({
      where: {
        id,
      },
    });

    if (!lead) {
      throw new HttpError(404, 'Заявка не найдена');
    }

    return lead;
  }

  async updateStatus(id: number, status: LeadStatus) { // Обновление статуса заявки
    await this.getLeadById(id);

    return prisma.lead.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

  async getStats() { //Получение статистики по заявкам
    const [total, newCount, inProgressCount, closedCount] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({
        where: {
          status: LeadStatus.NEW,
        },
      }),
      prisma.lead.count({
        where: {
          status: LeadStatus.IN_PROGRESS,
        },
      }),
      prisma.lead.count({
        where: {
          status: LeadStatus.CLOSED,
        },
      }),
    ]);

    return {
      total,
      new: newCount,
      inProgress: inProgressCount,
      closed: closedCount,
    };
  }
}

export const leadService = new LeadService();
