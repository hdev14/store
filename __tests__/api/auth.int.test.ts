import { faker } from '@faker-js/faker';
import { deleteMock, getMock, postMock } from '@mocks/axios';
import createFakeAuthToken from '@tests/utils/createFakeAuthToken';

describe("Auth's Integration Tests", () => {
  let fakeToken: string;

  beforeAll(() => {
    fakeToken = createFakeAuthToken();
  });

  describe('POST: /auth', () => {
    afterEach(() => {
      postMock.mockClear();
    });

    it('returns a 400 if email and password are not valid', async () => {
      expect.assertions(2);

      const data = {
        email: faker.name.fullName(), // wrong
        password: faker.random.alphaNumeric(5), // Small password
      };

      const response = await globalThis.request
        .post('/auth/')
        .set('Content-Type', 'application/json')
        .send(data);

      expect(response.status).toEqual(400);
      expect(response.body.errors).toHaveLength(2);
    });

    it('returns a 401 if the KeycloakIAM returns a HttpError of status code 401', async () => {
      expect.assertions(2);

      postMock.mockRejectedValueOnce({
        response: {
          status: 401,
          data: {
            message: 'test',
          },
        },
      });

      const data = {
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(10),
      };

      const response = await globalThis.request
        .post('/auth/')
        .set('Content-Type', 'application/json')
        .send(data);

      expect(response.status).toEqual(401);
      expect(response.body).toEqual({
        message: 'test',
      });
    });

    it('returns a 502 if the KeycloakIAM returns a HttpError different of status code 401', async () => {
      expect.assertions(2);

      postMock.mockRejectedValueOnce({
        response: {
          status: faker.internet.httpStatusCode({ types: ['serverError', 'clientError'] }),
          data: {
            message: 'test',
          },
        },
      });

      const data = {
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(10),
      };

      const response = await globalThis.request
        .post('/auth/')
        .set('Content-Type', 'application/json')
        .send(data);

      expect(response.status).toEqual(502);
      expect(response.body).toEqual({
        message: 'Erro ao tentar se comunicar com o serviço de identidade.',
      });
    });

    it('returns a 200 with the token payload', async () => {
      expect.assertions(2);

      const fakeAccessToken = faker.random.alphaNumeric(10);

      postMock.mockResolvedValueOnce({
        status: 200,
        data: {
          access_token: fakeAccessToken,
          expires_in: faker.datatype.number(),
        },
      });

      const data = {
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(10),
      };

      const response = await globalThis.request
        .post('/auth/')
        .set('Content-Type', 'application/json')
        .send(data);

      expect(response.status).toEqual(200);
      expect(response.body.token).toEqual(fakeAccessToken);
    });
  });

  describe('PATCH: /auth/permissions/:userId', () => {
    beforeAll(() => {
      // Mock once because of the expiredAt.
      postMock.mockResolvedValueOnce({
        status: 200,
        data: {
          access_token: faker.random.alphaNumeric(10),
          expires_in: faker.datatype.number(),
        },
      });
    });

    afterAll(() => {
      postMock.mockClear();
      getMock.mockClear();
    });

    it("returns a 404 if user doesn't exist", async () => {
      expect.assertions(2);

      const fakeUserId = faker.datatype.uuid();
      const fakePermission = faker.word.verb();
      getMock.mockRejectedValueOnce({
        response: {
          status: 404,
        },
      });

      const response = await globalThis.request
        .patch(`/auth/permissions/${fakeUserId}`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .send({ permission: fakePermission });

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual('Usuário não encontrado.');
    });

    it('returns a 400 if keycloak returns 400', async () => {
      expect.assertions(2);

      const fakeUserId = faker.datatype.uuid();
      const fakePermission = faker.word.verb();
      getMock.mockResolvedValueOnce({
        data: {
          id: fakeUserId,
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
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
      postMock.mockRejectedValueOnce({
        response: {
          status: 400,
        },
      });

      const response = await globalThis.request
        .patch(`/auth/permissions/${fakeUserId}`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .send({ permission: fakePermission });

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('Não foi possível vincular a permissão.');
    });

    it('returns a 400 if keycloak returns 404', async () => {
      expect.assertions(2);

      const fakeUserId = faker.datatype.uuid();
      const fakePermission = faker.word.verb();
      getMock.mockResolvedValueOnce({
        data: {
          id: fakeUserId,
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
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
      postMock.mockRejectedValueOnce({
        response: {
          status: 404,
        },
      });

      const response = await globalThis.request
        .patch(`/auth/permissions/${fakeUserId}`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .send({ permission: fakePermission });

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('Não foi possível vincular a permissão.');
    });

    it('returns a 204 after adding the permission', async () => {
      expect.assertions(1);

      const fakeUserId = faker.datatype.uuid();
      const fakePermission = faker.word.verb();
      getMock.mockResolvedValueOnce({
        data: {
          id: fakeUserId,
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
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
      postMock.mockResolvedValueOnce({
        response: {
          status: 204,
          data: {},
        },
      });

      const response = await globalThis.request
        .patch(`/auth/permissions/${fakeUserId}`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .send({ permission: fakePermission });

      expect(response.status).toEqual(204);
    });
  });

  describe('DELETE: /auth/permissions/:userId', () => {
    beforeAll(() => {
      // Mock once because of the expiredAt.
      postMock.mockResolvedValueOnce({
        status: 200,
        data: {
          access_token: faker.random.alphaNumeric(10),
          expires_in: faker.datatype.number(),
        },
      });
    });

    afterAll(() => {
      postMock.mockClear();
      getMock.mockClear();
    });

    it("returns a 404 if user doesn't exist", async () => {
      expect.assertions(2);

      const fakeUserId = faker.datatype.uuid();
      const fakePermission = faker.word.verb();
      getMock.mockRejectedValueOnce({
        response: {
          status: 404,
        },
      });

      const response = await globalThis.request
        .delete(`/auth/permissions/${fakeUserId}`)
        .auth(fakeToken, { type: 'bearer' })
        .send({ permission: fakePermission });

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual('Usuário não encontrado.');
    });

    it('returns a 400 if keycloak returns 400', async () => {
      expect.assertions(2);

      const fakeUserId = faker.datatype.uuid();
      const fakePermission = faker.word.verb();
      getMock.mockResolvedValueOnce({
        data: {
          id: fakeUserId,
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
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
      deleteMock.mockRejectedValueOnce({
        response: {
          status: 400,
        },
      });

      const response = await globalThis.request
        .delete(`/auth/permissions/${fakeUserId}`)
        .auth(fakeToken, { type: 'bearer' })
        .send({ permission: fakePermission });

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('Não foi possível vincular a permissão.');
    });

    it('returns a 400 if keycloak returns 404', async () => {
      expect.assertions(2);

      const fakeUserId = faker.datatype.uuid();
      const fakePermission = faker.word.verb();
      getMock.mockResolvedValueOnce({
        data: {
          id: fakeUserId,
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
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
      deleteMock.mockRejectedValueOnce({
        response: {
          status: 404,
        },
      });

      const response = await globalThis.request
        .delete(`/auth/permissions/${fakeUserId}`)
        .auth(fakeToken, { type: 'bearer' })
        .send({ permission: fakePermission });

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual('Não foi possível vincular a permissão.');
    });

    it('returns a 204 after removing the permission', async () => {
      expect.assertions(1);

      const fakeUserId = faker.datatype.uuid();
      const fakePermission = faker.word.verb();
      getMock.mockResolvedValueOnce({
        data: {
          id: fakeUserId,
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
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
      deleteMock.mockResolvedValueOnce({
        response: {
          status: 204,
          data: {},
        },
      });

      const response = await globalThis.request
        .delete(`/auth/permissions/${fakeUserId}`)
        .auth(fakeToken, { type: 'bearer' })
        .send({ permission: fakePermission });

      expect(response.status).toEqual(204);
    });
  });
});
