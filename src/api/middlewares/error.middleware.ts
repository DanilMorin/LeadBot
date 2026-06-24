/*
 *middleware обработки ошибок
 */
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../utils/http-error';
import { logger } from '../../utils/logger';

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      error: error.message,
    });
    return;
  }

  logger.error('API error', error);

  res.status(500).json({
    error: 'Internal server error',
  });
}