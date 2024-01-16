import { HttpException } from '@exceptions/HttpException';
import { NextFunction, Request, Response } from 'express';
import { logger } from '@utils/logger';

const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (error.name == 'ValidateError') {
      const err = formatErrors(error.fields);
      return res.status(400).json({
        message: err,
      });
    } else {
      const status: number = error.status || 500;
      const message: string = error.message || 'Something went wrong';
      console.log('errpr', error);
      logger.error(
        `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`,
      );
      res.status(status).json({ message });
    }
  } catch (error) {
    next(error);
  }
};

const formatErrors = (fields: string[]) => {
  let message = '';
  const errors: any = Object.entries(fields)[0];
  if (errors) {
    const [field, details] = errors;
    const key = field.replace(/^body\./, '');
    if (details.value == undefined) {
      message = `${key} is required`;
    } else {
      message = `${key} has ${details.message}`;
    }
    return message;
  }
};
export default errorMiddleware;
