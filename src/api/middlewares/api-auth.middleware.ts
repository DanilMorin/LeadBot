/*
 *middleware авторизации API
 */
import { NextFunction, Request, Response } from 'express';
import { env } from '../../config/env';
import { HttpError } from '../../utils/http-error';

export function apiAuthMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token || token !== env.apiToken) { //если токен не совпадает с ожидаемым, возвращаем ошибку 401 Unauthorized
        next(new HttpError(401, 'Unauthorized'));
        return;
    }

    next();
}