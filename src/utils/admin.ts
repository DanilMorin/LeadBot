import { env } from '../config/env';

export function isAdminChat(chatId: number | string): boolean {
  return String(chatId) === String(env.adminChatId);
}