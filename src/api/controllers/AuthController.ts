import HttpStatusCodes from '@api/HttpStatusCodes';
import HttpError from '@shared/errors/HttpError';
import ValidationError from '@shared/errors/ValidationError';
import IAuthService from '@users/app/IAuthService';
import UserNotFoundError from '@users/app/UserNotFoundError';
import { NextFunction, Request, Response } from 'express';

export default class AuthController {
  constructor(private readonly authService: IAuthService) { }

  public async auth(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, password } = request.body;

      const paylaod = await this.authService.auth(email, password);

      return response.status(HttpStatusCodes.OK).json(paylaod);
    } catch (e: any) {
      if (e instanceof ValidationError) {
        return response.status(400).json({ errors: e.errors });
      }

      if (e instanceof HttpError) {
        if (e.statusCode === 401) {
          return response.status(HttpStatusCodes.UNAUTHORIZED).json(e.body);
        }

        return response.status(HttpStatusCodes.BAD_GATEWAY).json({ message: 'Erro ao tentar se comunicar com o serviço de identidade.' });
      }

      return next(e);
    }
  }

  public async addPermission(request: Request, response: Response, next: NextFunction) {
    try {
      const { userId } = request.params;
      const { permission } = request.body;

      await this.authService.addPermission(userId, permission);

      return response.status(HttpStatusCodes.NO_CONTENT).json();
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        return response.status(HttpStatusCodes.NOT_FOUND).json({ message: e.message });
      }

      if (e instanceof HttpError && (e.statusCode === 400 || e.statusCode === 404)) {
        return response.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Não foi possível vincular a permissão.' });
      }

      return next(e);
    }
  }

  public async removePermission(request: Request, response: Response, next: NextFunction) {
    try {
      const { userId } = request.params;
      const { permission } = request.body;

      await this.authService.removePermission(userId, permission);

      return response.status(HttpStatusCodes.NO_CONTENT).json();
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        return response.status(HttpStatusCodes.NOT_FOUND).json({ message: e.message });
      }

      if (e instanceof HttpError && (e.statusCode === 400 || e.statusCode === 404)) {
        return response.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Não foi possível vincular a permissão.' });
      }

      return next(e);
    }
  }
}
