import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exceptions/api-error';

export const globalErrorHandler = (
  error: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof ApiError) {
    return res.status(error.status).send({ message: error.message, errors: error.errors });
  } else {
    return res.status(500).send({ message: 'Непредвиденная ошибка!' });
  }
};
