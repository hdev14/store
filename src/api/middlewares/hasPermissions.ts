import HttpStatusCodes from '@api/HttpStatusCodes';
import { NextFunction, Request, Response } from 'express';

export type Spec = {
  and?: string[]
  or?: string[]
}

function containsRoles(spec: Spec, roles: string[]) {
  let containsAllRoles = true;
  let containsSomeRoles = true;

  const isASimpleOperation = (spec.and && spec.or && spec.and.length > 0 && spec.or.length === 1);

  if (isASimpleOperation) {
    throw new Error('Use just "and" instead.');
  }

  if (spec.and) {
    containsAllRoles = spec.and.every((role) => roles.includes(role));
  }

  if (spec.or) {
    containsSomeRoles = spec.or.some((role) => roles.includes(role));
  }

  return containsAllRoles && containsSomeRoles;
}

export default function hasPermissions(spec: Spec | string) {
  return (request: Request & { roles: string [] }, response: Response, next: NextFunction) => {
    if (request.roles && request.roles.length) {
      if (typeof spec === 'string' && request.roles.includes(spec)) {
        return next();
      }

      if (typeof spec === 'object' && containsRoles(spec, request.roles)) {
        return next();
      }
    }

    return response.status(HttpStatusCodes.FORBIDDEN).json({
      message: 'Sem permissão para acessar esse recurso.',
    });
  };
}
