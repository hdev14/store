import { NextFunction, Request, Response } from 'express';

// TODO: add implementation
export default class AuthController {
  public async auth(request: Request, response: Response, next: NextFunction) {
    try {
      return response.status(200).json();
    } catch (e) {
      // TODO: validate HttpError (401)
      return next(e);
    }
  }

  public async addPermission(request: Request, response: Response, next: NextFunction) {
    try {
      return response.status(200).json();
    } catch (e) {
      // TODO: validate HttpError (401)
      return next(e);
    }
  }

  public async removePermission(request: Request, response: Response, next: NextFunction) {
    try {
      return response.status(200).json();
    } catch (e) {
      // TODO: validate HttpError (401)
      return next(e);
    }
  }
}
