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

      return response.status(200).json(paylaod);
    } catch (e: any) {
      if (e instanceof ValidationError) {
        return response.status(400).json({ errors: e.errors });
      }

      if (e instanceof HttpError) {
        if (e.statusCode === 401) {
          return response.status(401).json(e.body);
        }

        return response.status(502).json({ message: 'Erro ao tentar se comunicar com o serviço de identidade.' });
      }

      return next(e);
    }
  }

  public async addPermission(request: Request, response: Response, next: NextFunction) {
    try {
      const { userId, permission } = request.params;

      await this.authService.addPermission(userId, permission);

      return response.status(204).json();
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        return response.status(404).json({ message: e.message });
      }

      if (e instanceof HttpError && (e.statusCode === 400 || e.statusCode === 404)) {
        return response.status(400).json({ message: 'Não foi possível vincular a permissão.' });
      }

      return next(e);
    }
  }

  public async removePermission(request: Request, response: Response, next: NextFunction) {
    try {
      const { userId, permission } = request.params;

      await this.authService.removePermission(userId, permission);

      return response.status(204).json();
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        return response.status(404).json({ message: e.message });
      }

      if (e instanceof HttpError && (e.statusCode === 400 || e.statusCode === 404)) {
        return response.status(400).json({ message: 'Não foi possível vincular a permissão.' });
      }

      return next(e);
    }
  }
}
