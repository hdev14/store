import { NextFunction, Request, Response } from 'express';

// TODO: add all methods
export default class UserController {
  public async createUser(_: Request, response: Response, next: NextFunction) {
    try {
      return response.status(204).json();
    } catch (e) {
      return next(e);
    }
  }
}
