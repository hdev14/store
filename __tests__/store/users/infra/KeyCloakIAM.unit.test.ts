import { faker } from '@faker-js/faker';
import IHttpClient from '@shared/abstractions/IHttpClient';
import User from '@users/domain/User';
import KeyCloakIAM from '@users/infra/IAM/KeyCloakIAM';
import { mock, mockClear } from 'jest-mock-extended';

const httpClientMock = mock<IHttpClient>();

jest.useFakeTimers();
const setIntervalSpy = jest.spyOn(global, 'setInterval');

describe("KeyCloakIAM's unit tests", () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    setIntervalSpy.mockImplementation((() => faker.datatype.number()) as any);

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

  beforeEach(() => {
    mockClear(httpClientMock);
  });

  it('calls HttpClient.post with correct params to request the auth endpont of keycloak admin API', () => {
    httpClientMock.post.mockResolvedValueOnce({
      status: 200,
      body: { access_token: faker.random.alphaNumeric(10), expires_in: faker.datatype.number() },
    });

    // eslint-disable-next-line no-new
    new KeyCloakIAM(httpClientMock);

    expect(httpClientMock.post).toHaveBeenCalledWith(
      'http://keycloak.test/realms/test_realm/protocol/openid-connect/token',
      new URLSearchParams({
        client_id: 'test_client_id',
        client_secret: 'test_client_secret',
        grant_type: 'client_credentials',
        scope: 'openid',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
  });

  it('calls setInterval to request the auth endpoint of keycloak admin API every 58 seconds', () => {
    httpClientMock.post.mockResolvedValueOnce({
      status: 200,
      body: { access_token: faker.random.alphaNumeric(10), expires_in: faker.datatype.number() },
    });

    // eslint-disable-next-line no-new
    new KeyCloakIAM(httpClientMock);

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 58000);
  });

  describe('KeyCloakIAM.auth()', () => {
    it('calls HttpClient.post with correct params to request the auth endpont of keycloak admin API', async () => {
      expect.assertions(1);

      httpClientMock.post.mockResolvedValue({
        status: 200,
        body: { access_token: faker.random.alphaNumeric(10), expires_in: faker.datatype.number() },
      });

      const iam = new KeyCloakIAM(httpClientMock);

      const fakeEmail = faker.internet.email();
      const fakePassword = faker.random.alphaNumeric(10);

      await iam.auth(fakeEmail, fakePassword);

      expect(httpClientMock.post).toHaveBeenNthCalledWith(
        2,
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

    it('returns the correct TokenPayload after request the register user endpoint of keycloak admin API', async () => {
      expect.assertions(2);

      const fakeBody = {
        access_token: faker.random.alphaNumeric(10),
        expires_in: faker.datatype.number(),
      };

      httpClientMock.post.mockResolvedValue({
        status: 200,
        body: fakeBody,
      });

      const iam = new KeyCloakIAM(httpClientMock);

      const fakeEmail = faker.internet.email();
      const fakePassword = faker.random.alphaNumeric(10);

      const payload = await iam.auth(fakeEmail, fakePassword);

      expect(payload.accessToken).toEqual(fakeBody.access_token);
      expect(payload.expiresIn).toEqual(fakeBody.expires_in);
    });
  });

  describe('KeyCloakIAM.registerUser()', () => {
    let iam: KeyCloakIAM;
    const fakeAccessToken = faker.random.alphaNumeric(10);

    beforeAll(() => {
      httpClientMock.post.mockResolvedValue({
        status: 200,
        body: { access_token: fakeAccessToken, expires_in: faker.datatype.number() },
      });

      iam = new KeyCloakIAM(httpClientMock);
    });

    it(
      'calls HttpClient.post with correct params to request the endpoint to create a new user in keycloak admin API',
      async () => {
        expect.assertions(1);

        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();

        const user = new User({
          id: faker.datatype.uuid(),
          name: `${firstName} ${lastName}`,
          document: '123.456.789-10',
          email: faker.internet.email(),
          createdAt: new Date(),
          password: faker.random.alphaNumeric(10),
        });

        await iam.registerUser(user);

        expect(httpClientMock.post).toHaveBeenCalledWith(
          'http://keycloak.test/admin/realms/test_realm/users',
          {
            id: user.id,
            firstName,
            lastName,
            email: user.email,
            attributes: {
              document: user.document,
            },
            credentials: [{
              type: 'password',
              value: user.password,
              temporary: false,
            }],
          },
          { headers: { Authorization: `Bearer ${fakeAccessToken}` } },
        );
      },
    );
  });

  describe('KeyCloakIAM.updateUser()', () => {
    let iam: KeyCloakIAM;
    const fakeAccessToken = faker.random.alphaNumeric(10);

    beforeAll(() => {
      httpClientMock.post.mockResolvedValue({
        status: 200,
        body: { access_token: fakeAccessToken, expires_in: faker.datatype.number() },
      });

      iam = new KeyCloakIAM(httpClientMock);
    });

    it(
      'calls HttpClient.post with correct params to request the endpoint to update an user in keycloak admin API',
      async () => {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();

        const user = new User({
          id: faker.datatype.uuid(),
          name: `${firstName} ${lastName}`,
          document: '123.456.789-10',
          email: faker.internet.email(),
          createdAt: new Date(),
          password: faker.random.alphaNumeric(10),
        });

        await iam.updateUser(user);

        expect(httpClientMock.put).toHaveBeenCalledWith(
          `http://keycloak.test/admin/realms/test_realm/users/${user.id}`,
          {
            firstName,
            lastName,
            email: user.email,
            attributes: {
              document: user.document,
            },
            credentials: [{
              type: 'password',
              value: user.password,
              temporary: false,
            }],
          },
          { headers: { Authorization: `Bearer ${fakeAccessToken}` } },
        );
      },
    );
  });
});
