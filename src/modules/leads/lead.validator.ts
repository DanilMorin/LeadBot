/*
 * Содержит чистые функции проверки полей заявки без зависимости от Telegram и базы данных
 */

export function isValidPhone(phone: string): boolean {
  return /^[\d\s()+-]{7,20}$/.test(phone);
}

export function isValidName(name: string): boolean {
  return name.length >= 2 && name.length <= 100;
}

export function isValidService(service: string): boolean {
  return service.length >= 2 && service.length <= 200;
}
