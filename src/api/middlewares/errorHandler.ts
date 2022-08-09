import ProductNotFoundError from '@catalog/app/ProductNotFoundError';
import { NextFunction, Request, Response } from 'express';

function errorHandler(error: Error, _: Request, response: Response, __: NextFunction) {
  console.error(error.stack);

  if (error instanceof ProductNotFoundError) {
    return response.status(404).json({ message: error.message });
  }

  return response.status(500).json({ message: 'Internal Server Error' });
}

export default errorHandler;
