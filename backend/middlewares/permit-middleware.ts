import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from './auth-middleware';
import { ApiError } from '../exceptions/api-error';

const permit = (...roles: string[]) => {
  return (expressReq: Request, res: Response, next: NextFunction) => {
    const req = expressReq as RequestWithUser;

    if (!req.user) {
      return next(ApiError.UnauthorizedError());
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.Forbidden('У Вас недостаточно прав!'));
    }

    return next();
  };
};

export default permit;
