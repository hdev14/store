import HttpStatusCodes from '@api/HttpStatusCodes';
import HttpError from '@shared/errors/HttpError';
import ValidationError from '@shared/errors/ValidationError';
import IUserService from '@users/app/IUserService';
import UserNotFoundError from '@users/app/UserNotFoundError';
import { NextFunction, Request, Response } from 'express';

// TODO: add all methods
export default class UserController {
  constructor(private readonly userService: IUserService) { }

  public async createUser(request: Request, response: Response, next: NextFunction) {
    try {
      const {
        name, email, document, password,
      } = request.body;

      const user = await this.userService.createUser({
        name,
        email,
        document,
        password,
      });

      return response.status(HttpStatusCodes.CREATED).json(user);
    } catch (e) {
      if (e instanceof ValidationError) {
        return response.status(HttpStatusCodes.BAD_REQUEST).json({ errors: e.errors });
      }

      if (e instanceof HttpError && e.statusCode === 400) {
        return response.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json({
          message: 'Dados inválido. Não foi possível cadastrar o usuário.',
        });
      }

      return next(e);
    }
  }

  public async updateUser(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;
      const {
        name, email, document, password,
      } = request.body;

      const user = await this.userService.updateUser(id, {
        name,
        email,
        document,
        password,
      });

      return response.status(200).json(user);
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        return response.status(HttpStatusCodes.NOT_FOUND).json({
          message: e.message,
        });
      }

      if (e instanceof ValidationError) {
        return response.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: e.errors,
        });
      }

      return next(e);
    }
  }

  public async getUser(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      const user = await this.userService.getUser(id);

      return response.status(200).json(user);
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        return response.status(HttpStatusCodes.NOT_FOUND).json({
          message: e.message,
        });
      }

      return next(e);
    }
  }

  public async getUsers(_: Request, response: Response, next: NextFunction) {
    try {
      return response.status(204).json();
    } catch (e) {
      return next(e);
    }
  }
}
