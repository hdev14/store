import HttpStatusCodes from '@api/HttpStatusCodes';
import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';

export default async function auth(request: Request & { roles: string[] }, response: Response, next: NextFunction) {
  const header = request.get('Authorization');

  if (!header) {
    return response.status(HttpStatusCodes.UNAUTHORIZED).json({
      message: 'Token de autorização não fornecido.',
    });
  }

  try {
    const [, token] = header.split(' ');

    const payload: any = jwt.verify(token, process.env.KC_CLIENT_PUBLIC_KEY!);

    console.info('TOKEN PAYLOAD ->', payload);

    const allRoles: string[] = payload.realm_access.roles;

    const applicationKeys = Object.keys(payload.resource_access);
    const mappedRoles = applicationKeys.map((key) => payload.resource_access[key].roles);

    for (const roles of mappedRoles) {
      allRoles.push(...roles);
    }

    console.info('ROLES ->', allRoles);

    request.roles = allRoles;

    return next();
  } catch (e) {
    if (e instanceof JsonWebTokenError) {
      return response.status(HttpStatusCodes.FORBIDDEN).json({
        message: 'Token não autorizado.',
      });
    }

    return next(e);
  }
}
