/*
 * Содержит чистые функции проверки и нормализации полей заявки.
 */

export function normalizeRussianPhone(phone: string): string | null {
  if (/[^\d\s()+-]/.test(phone)) {
    return null;
  }

  const digits = phone.replace(/\D/g, '');
  const normalizedDigits = digits.startsWith('8')
    ? `7${digits.slice(1)}`
    : digits;

  if (!/^79\d{9}$/.test(normalizedDigits)) {
    return null;
  }

  return `+${normalizedDigits}`;
}

export function isValidPhone(phone: string): boolean {
  return normalizeRussianPhone(phone) !== null;
}

export function isValidName(name: string): boolean {
  return name.length >= 2 && name.length <= 100;
}

export function isValidService(service: string): boolean {
  return service.length >= 2 && service.length <= 200;
}
