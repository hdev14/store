import { KeycloakTokenPayload } from '@api/middlewares/auth';
import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';

export default function createFakeAuthToken(customRoles: string[] = []) {
  const tokenPayload: Partial<KeycloakTokenPayload> = {
    realm_access: {
      roles: customRoles,
    },
    resource_access: {
      test: {
        roles: customRoles,
      },
    },
    name: faker.name.fullName(),
    preferred_username: faker.internet.userName(),
    given_name: faker.name.firstName(),
    family_name: faker.name.lastName(),
    email: faker.internet.email(),
  };

  const token = jwt.sign(tokenPayload, process.env.KEYCLOAK_CLIENT_PUBLIC_KEY!, {
    expiresIn: 60_000,
  });

  return token;
}
