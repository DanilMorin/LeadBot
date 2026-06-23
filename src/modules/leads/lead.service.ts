/*`* сервис для взаимодействия с таблицей lead */

import { LeadStatus } from '@prisma/client';
import { prisma } from '../../database/prisma';

type CreateLeadData = {
  telegramId?: number;
  name: string;
  phone: string;
  service: string;
  comment?: string;
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

  async getLastLeads(limit = 10) {
    return prisma.lead.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async updateStatus(id: number, status: LeadStatus) {
    return prisma.lead.update({
      where: { id },
      data: { status },
    });
  }

  async getLeadsByStatus(status: LeadStatus, limit = 10) {
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
}

export const leadService = new LeadService();