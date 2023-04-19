import HttpStatusCodes from '@api/HttpStatusCodes';
import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';

export type KeycloakTokenPayload = {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string[];
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  'allowed-origins': string[];
  realm_access: {
    roles: string[];
  };
  resource_access: Record<string, { roles: string[] }>;
  scope: string;
  sid: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

export default async function auth(request: Request & { roles?: string[] }, response: Response, next: NextFunction) {
  const header = request.get('Authorization');

  if (!header) {
    console.info(header);
    console.info('header');
    return response.status(HttpStatusCodes.UNAUTHORIZED).json({
      message: 'Token de autorização não fornecido.',
    });
  }

  try {
    const [, token] = header.split(' ');

    const payload = <KeycloakTokenPayload> jwt.verify(token, process.env.KEYCLOAK_CLIENT_PUBLIC_KEY!);

    // console.info('TOKEN PAYLOAD ->', payload);

    const allRoles: string[] = payload.realm_access.roles;

    const applicationKeys = Object.keys(payload.resource_access);
    const mappedRoles = applicationKeys.map((key) => payload.resource_access[key].roles);

    for (const roles of mappedRoles) {
      allRoles.push(...roles);
    }

    // console.info('ROLES ->', allRoles);

    request.roles = allRoles;

    return next();
  } catch (e: any) {
    console.error(e.stack);
    if (e instanceof JsonWebTokenError) {
      return response.status(HttpStatusCodes.FORBIDDEN).json({
        message: 'Token não autorizado.',
      });
    }

    return next(e);
  }
}
