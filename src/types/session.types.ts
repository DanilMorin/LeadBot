export type LeadStep = 'name' | 'phone' | 'service' | 'comment';

export type LeadDraft = {
  step: LeadStep;
  name?: string;
  phone?: string;
  service?: string;
  comment?: string;
};

export const leadDrafts = new Map<number, LeadDraft>();