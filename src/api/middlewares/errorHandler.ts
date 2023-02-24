import { NextFunction, Request, Response } from 'express';

function errorHandler(error: Error, _: Request, response: Response, __: NextFunction) {
  console.error(error.stack);
  console.error(error.cause);

  return response.status(500).json({ message: 'Internal Server Error' });
}

export default errorHandler;
