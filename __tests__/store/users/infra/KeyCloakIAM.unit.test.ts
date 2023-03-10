import { faker } from '@faker-js/faker';
import IHttpClient from '@shared/abstractions/IHttpClient';
import KeyCloakIAM from '@users/infra/IAM/KeyCloakIAM';
import { mock, mockClear } from 'jest-mock-extended';

const httpClientMock = mock<IHttpClient>();

beforeEach(() => {
  mockClear(httpClientMock);
});

describe("KeyCloakIAM's unit tests", () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = {
      ...OLD_ENV,
      KEYCLOAK_BASE_URL: 'http://keycloak.test',
      KEYCLOAK_REALM_NAME: 'test_realm',
      KEYCLOAK_CLIENT_ID: 'test_client_id',
      KEYCLOAK_CLIENT_SECRET: 'test_client_secret',
    };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('KeyCloakIAM.auth()', () => {
    it('calls HttpClient.post with correct params to request keycloak admin API', async () => {
      expect.assertions(1);

      httpClientMock.post.mockResolvedValueOnce({
        status: 200,
        body: { access_token: faker.random.alphaNumeric(), expires_in: faker.datatype.number() },
      });

      const iam = new KeyCloakIAM(httpClientMock);

      const fakeEmail = faker.internet.email();
      const fakePassword = faker.random.alphaNumeric();

      await iam.auth(fakeEmail, fakePassword);

      expect(httpClientMock.post).toHaveBeenCalledWith(
        'http://keycloak.test/realms/test_realm/protocol/openid-connect/token',
        new URLSearchParams({
          client_id: 'test_client_id',
          client_secret: 'test_client_secret',
          grant_type: 'password',
          username: fakeEmail,
          password: fakePassword,
          scope: 'openid',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
    });

    it('returns the correct TokenPayload after request the keycloak admin API', async () => {
      expect.assertions(2);

      const fakeBody = {
        access_token: faker.random.alphaNumeric(),
        expires_in: faker.datatype.number(),
      };

      httpClientMock.post.mockResolvedValueOnce({
        status: 200,
        body: fakeBody,
      });

      const iam = new KeyCloakIAM(httpClientMock);

      const fakeEmail = faker.internet.email();
      const fakePassword = faker.random.alphaNumeric();

      const payload = await iam.auth(fakeEmail, fakePassword);

      expect(payload.accessToken).toEqual(fakeBody.access_token);
      expect(payload.expiresIn).toEqual(fakeBody.expires_in);
    });
  });
});
