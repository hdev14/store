import { faker } from '@faker-js/faker';
import IHttpClient from '@shared/abstractions/IHttpClient';
import HttpError from '@shared/errors/HttpError';
import User from '@users/domain/User';
import KeyCloakIAM from '@users/infra/IAM/KeyCloakIAM';
import { mock, mockClear } from 'jest-mock-extended';

const httpClientMock = mock<IHttpClient>();

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

  beforeEach(() => {
    mockClear(httpClientMock);
  });

  describe('KeyCloakIAM.auth()', () => {
    let iam: KeyCloakIAM;

    beforeAll(() => {
      httpClientMock.post.mockResolvedValue({
        status: 200,
        body: { access_token: faker.random.alphaNumeric(10), expires_in: faker.datatype.number() },
      });

      iam = new KeyCloakIAM(httpClientMock);
    });

    it('calls HttpClient.post with correct params to request the auth endpont of keycloak admin API', async () => {
      expect.assertions(1);

      const fakeEmail = faker.internet.email();
      const fakePassword = faker.random.alphaNumeric(10);

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

    it('returns the correct TokenPayload after request the register user endpoint of keycloak admin API', async () => {
      expect.assertions(2);

      const fakeBody = {
        access_token: faker.random.alphaNumeric(10),
        expires_in: faker.datatype.number(),
      };

      httpClientMock.post.mockResolvedValueOnce({
        status: 200,
        body: fakeBody,
      });

      const fakeEmail = faker.internet.email();
      const fakePassword = faker.random.alphaNumeric(10);

      const payload = await iam.auth(fakeEmail, fakePassword);

      expect(payload.access_token).toEqual(fakeBody.access_token);
      expect(payload.expires_in).toEqual(fakeBody.expires_in);
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
          document: '69156949430',
          email: faker.internet.email(),
          created_at: new Date(),
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
              document: user.document.value,
            },
            credentials: [{
              type: 'password',
              value: user.password,
              temporary: false,
            }],
            createdTimestamp: user.created_at.getTime(),
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

    it('calls HttpClient.post with correct params to request the endpoint to update an user in keycloak admin API', async () => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();

      const user = new User({
        id: faker.datatype.uuid(),
        name: `${firstName} ${lastName}`,
        document: '69156949430',
        email: faker.internet.email(),
        created_at: new Date(),
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
            document: user.document.value,
          },
          credentials: [{
            type: 'password',
            value: user.password,
            temporary: false,
          }],
        },
        { headers: { Authorization: `Bearer ${fakeAccessToken}` } },
      );
    });
  });

  describe('KeyCloakIAM.getUser()', () => {
    let iam: KeyCloakIAM;
    const fakeAccessToken = faker.random.alphaNumeric(10);

    beforeAll(() => {
      httpClientMock.post.mockResolvedValue({
        status: 200,
        body: { access_token: fakeAccessToken, expires_in: faker.datatype.number() },
      });

      iam = new KeyCloakIAM(httpClientMock);
    });

    it('calls HttpClient.get with correct params to request the endpoint to retrieve the user info from keycloak admin API', async () => {
      expect.assertions(1);

      const fakeUserId = faker.datatype.uuid();

      httpClientMock.get.mockResolvedValueOnce({
        status: 200,
        body: {
          id: fakeUserId,
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          email: faker.internet.email(),
          attributes: {
            document: '69156949430',
          },
          credentials: [{
            type: 'password',
            value: faker.random.alphaNumeric(7).toString(),
            temporary: false,
          }],
        },
      });

      await iam.getUser(fakeUserId);

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `http://keycloak.test/admin/realms/test_realm/users/${fakeUserId}`,
        { headers: { Authorization: `Bearer ${fakeAccessToken}` } },
      );
    });

    it('returns an User after calling HttpClient.get method', async () => {
      expect.assertions(6);

      const fakeUserId = faker.datatype.uuid();

      const fakeBody = {
        id: fakeUserId,
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        created_timestamp: new Date().getTime(),
        attributes: {
          document: '691.569.494-30',
        },
        credentials: [{
          type: 'password',
          value: faker.random.alphaNumeric(6).toString(),
          temporary: false,
        }],
      };

      httpClientMock.get.mockResolvedValueOnce({
        status: 200,
        body: fakeBody,
      });

      const user = await iam.getUser(fakeUserId);

      expect(user).toBeInstanceOf(User);
      expect(user!.id).toEqual(fakeBody.id);
      expect(user!.name).toEqual(`${fakeBody.first_name} ${fakeBody.last_name}`);
      expect(user!.email).toEqual(fakeBody.email);
      expect(user!.document.value).toEqual('69156949430');
      expect(user!.created_at).toEqual(new Date(fakeBody.created_timestamp));
    });

    it('returns null if occur a HttpError with status code 404', async () => {
      expect.assertions(1);

      const fakeUserId = faker.datatype.uuid();

      httpClientMock.get.mockRejectedValueOnce(new HttpError(404, {}));

      const user = await iam.getUser(fakeUserId);

      expect(user).toBeNull();
    });
  });

  describe('KeyCloakIAM.getUsers()', () => {
    let iam: KeyCloakIAM;
    const fakeAccessToken = faker.random.alphaNumeric(10);

    beforeAll(() => {
      httpClientMock.post.mockResolvedValue({
        status: 200,
        body: { access_token: fakeAccessToken, expires_in: faker.datatype.number() },
      });

      iam = new KeyCloakIAM(httpClientMock);
    });

    it('calls HttpClient.get with correct params to request the endpoint to retrieve the users info from keycloak admin API', async () => {
      expect.assertions(1);

      httpClientMock.get.mockResolvedValueOnce({
        status: 200,
        body: [{
          id: faker.datatype.uuid(),
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          email: faker.internet.email(),
          attributes: {
            document: '69156949430',
          },
          credentials: [{
            type: 'password',
            value: faker.random.alphaNumeric(6).toString(),
            temporary: false,
          }],
        }],
      });

      await iam.getUsers();

      expect(httpClientMock.get).toHaveBeenCalledWith(
        'http://keycloak.test/admin/realms/test_realm/users',
        { headers: { Authorization: `Bearer ${fakeAccessToken}` } },
      );
    });

    it('returns an array of User after calling HttpClient.get method', async () => {
      expect.assertions(11);

      const fakeBody = [
        {
          id: faker.datatype.uuid(),
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          email: faker.internet.email(),
          created_timestamp: new Date().getTime(),
          attributes: {
            document: '691.569.494-30',
          },
          credentials: [{
            type: 'password',
            value: faker.random.alphaNumeric(6).toString(),
            temporary: false,
          }],
        },
        {
          id: faker.datatype.uuid(),
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          email: faker.internet.email(),
          created_timestamp: new Date().getTime(),
          attributes: {
            document: '371.364.094-70',
          },
          credentials: [{
            type: 'password',
            value: faker.random.alphaNumeric(6).toString(),
            temporary: false,
          }],
        },
      ];

      httpClientMock.get.mockResolvedValueOnce({
        status: 200,
        body: fakeBody,
      });

      const users = await iam.getUsers();

      expect(users).toHaveLength(2);

      expect(users[0].id).toEqual(fakeBody[0].id);
      expect(users[0].name).toEqual(`${fakeBody[0].first_name} ${fakeBody[0].last_name}`);
      expect(users[0].email).toEqual(fakeBody[0].email);
      expect(users[0].document.value).toEqual('69156949430');
      expect(users[0].created_at).toEqual(new Date(fakeBody[0].created_timestamp));

      expect(users[1].id).toEqual(fakeBody[1].id);
      expect(users[1].name).toEqual(`${fakeBody[1].first_name} ${fakeBody[1].last_name}`);
      expect(users[1].email).toEqual(fakeBody[1].email);
      expect(users[1].document.value).toEqual('37136409470');
      expect(users[1].created_at).toEqual(new Date(fakeBody[1].created_timestamp));
    });

    it('calls HttpClient.get with pagaintion options if pagination is passed', async () => {
      expect.assertions(1);

      httpClientMock.get.mockResolvedValueOnce({
        status: 200,
        body: [{
          id: faker.datatype.uuid(),
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          email: faker.internet.email(),
          attributes: {
            document: '69156949430',
          },
          credentials: [{
            type: 'password',
            value: faker.random.alphaNumeric(6).toString(),
            temporary: false,
          }],
        }],
      });

      const pagination = {
        offset: 10.5,
        limit: 10.5,
      };

      await iam.getUsers(pagination);

      expect(httpClientMock.get.mock.calls[0][1]!.query).toEqual(new URLSearchParams({
        first: '11',
        max: '11',
      }));
    });
  });

  describe('KeyCloakIAM.addRole()', () => {
    let iam: KeyCloakIAM;
    const fakeAccessToken = faker.random.alphaNumeric(10);

    beforeAll(() => {
      httpClientMock.post.mockResolvedValue({
        status: 200,
        body: { access_token: fakeAccessToken, expires_in: faker.datatype.number() },
      });

      iam = new KeyCloakIAM(httpClientMock);
    });

    it('calls HttpClient.post with correct params to request the endpoint to add role to the user', async () => {
      expect.assertions(1);

      const fakeRoleId = faker.datatype.uuid();
      const fakeRole = faker.word.verb();

      httpClientMock.get.mockResolvedValueOnce({
        status: 204,
        body: {
          id: fakeRoleId,
          name: fakeRole,
          description: 'An example role.',
          composite: false,
          clientRole: false,
          containerId: 'realm-name',
          attributes: {},
        },
      });

      const fakeUserId = faker.datatype.uuid();

      await iam.addRole(fakeUserId, fakeRole);

      expect(httpClientMock.post).toHaveBeenCalledWith(
        `http://keycloak.test/admin/realms/test_realm/users/${fakeUserId}/role-mappings/realm`,
        [{ name: fakeRole, containerId: 'test_realm' }],
        { headers: { Authorization: `Bearer ${fakeAccessToken}` } },
      );
    });
  });

  describe('KeyCloakIAM.removeRole()', () => {
    let iam: KeyCloakIAM;
    const fakeAccessToken = faker.random.alphaNumeric(10);

    beforeAll(() => {
      httpClientMock.post.mockResolvedValue({
        status: 200,
        body: { access_token: fakeAccessToken, expires_in: faker.datatype.number() },
      });

      iam = new KeyCloakIAM(httpClientMock);
    });

    it('calls HttpClient.delete with correct params to request the endpoint to remove a role from the user', async () => {
      expect.assertions(1);

      httpClientMock.delete.mockResolvedValueOnce({
        status: 204,
        body: {},
      });

      const fakeUserId = faker.datatype.uuid();
      const fakeRole = faker.word.verb();

      await iam.removeRole(fakeUserId, fakeRole);

      expect(httpClientMock.delete).toHaveBeenCalledWith(
        `http://keycloak.test/admin/realms/test_realm/users/${fakeUserId}/role-mappings/realm`,
        [{ name: fakeRole, containerId: 'test_realm' }],
        { headers: { Authorization: `Bearer ${fakeAccessToken}` } },
      );
    });
  });
});
