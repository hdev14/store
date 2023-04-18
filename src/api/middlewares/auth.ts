import HttpStatusCodes from '@api/HttpStatusCodes';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// TODO: finish implementation
export default async function auth(request: Request, response: Response, next: NextFunction) {
  const header = request.get('Authorization');

  if (!header) {
    return response.status(HttpStatusCodes.UNAUTHORIZED).json({
      message: 'Token de autorização não fornecido.',
    });
  }

  const [, token] = header.split(' ');

  const payload: any = jwt.verify(token, process.env.KC_CLIENT_PUBLIC_KEY!);

  const allRoles: string[] = payload.realm_access.roles;

  const applicationKeys = Object.keys(payload.resource_access);
  const mappedRoles = applicationKeys.map((key) => payload.resource_access[key].roles);

  for (const roles of mappedRoles) {
    allRoles.push(...roles);
  }

  console.info(allRoles);

  return next();
}

// export default function hasPermissions(spec: Spec | string) {
//   return (request: Request, response: Response, next: NextFunction) => {
//     const session: any = request.session;

//     if (session.roles) {
//       if (typeof spec === 'string' && session.roles.includes(spec)) {
//         return next();
//       }

//       if (typeof spec === 'object' && containsRoles(spec, session.roles)) {
//         return next();
//       }
//     }

//     return response.render('403');
//   }
// }

// function containsRoles(spec: Spec, roles: string[]) {
//   let containsAllRoles = true;
//   let containsSomeRoles = true;

//   const isASimpleOperation = (spec.and && spec.or && spec.and.length > 0 && spec.or.length === 1);

//   if (isASimpleOperation) {
//     throw new Error('Use just "and" instead.');
//   }

//   if (spec.and) {
//     containsAllRoles = spec.and.every((role) => roles.includes(role));
//   }

//   if (spec.or) {
//     containsSomeRoles = spec.or.some((role) => roles.includes(role));
//   }

//   return containsAllRoles && containsSomeRoles;
// }
