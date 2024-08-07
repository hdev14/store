import { faker } from '@faker-js/faker';
import { axiosMock } from '@mocks/axios';
import createFakeAuthToken from '@tests/utils/createFakeAuthToken';

describe("User's Integration Tests", () => {
  let fakeToken: string;

  beforeAll(() => {
    fakeToken = createFakeAuthToken();

    axiosMock.post.mockResolvedValueOnce({
      status: 200,
      data: {
        access_token: faker.random.alphaNumeric(10),
        expires_in: faker.datatype.number(),
      },
    });
  });

  afterAll(() => {
    axiosMock.post.mockClear();
    axiosMock.get.mockClear();
    axiosMock.put.mockClear();
  });

  describe('POST: /users', () => {
    it('returns 400 if data is invalid', async () => {
      expect.assertions(2);

      const invalidData = {
        name: 123,
        email: 'invalidemail.com',
        document: '12345678910',
        password: '12345',
      };

      const response = await globalThis.request
        .post('/users/')
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .send(invalidData);

      expect(response.status).toEqual(400);
      expect(response.body.errors).toHaveLength(4);
    });

    it('returns 422 if keycloak returns 400', async () => {
      expect.assertions(2);

      const data = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        document: '69156949430',
        password: faker.random.alphaNumeric(6),
      };

      axiosMock.post.mockRejectedValueOnce({
        response: {
          status: 400,
          data: {},
        },
      });

      const response = await globalThis.request
        .post('/users/')
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .send(data);

      expect(response.status).toEqual(422);
      expect(response.body.message).toEqual('Dados inválido. Não foi possível cadastrar o usuário.');
    });

    it('returns 201 with the correct user', async () => {
      expect.assertions(7);

      const data = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        document: '69156949430',
        password: faker.random.alphaNumeric(6),
      };

      axiosMock.post.mockResolvedValueOnce({});

      const response = await globalThis.request
        .post('/users/')
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .send(data);

      expect(response.status).toEqual(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toEqual(data.name);
      expect(response.body.email).toEqual(data.email);
      expect(response.body.document).toEqual(data.document);
      expect(response.body.password).toBeUndefined();
      expect(response.body.created_at).toBeTruthy();
    });
  });

  describe('PUT: /users/:id', () => {
    it("returns 404 if user doesn't exists", async () => {
      expect.assertions(2);

      axiosMock.get.mockRejectedValueOnce({
        response: {
          status: 404,
          data: {},
        },
      });

      const fakeUserId = faker.datatype.uuid();

      const data = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        document: '69156949430',
        password: '123456',
      };

      const response = await globalThis.request
        .put(`/users/${fakeUserId}`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .send(data);

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual('Usuário não encontrado.');
    });

    it('returns 400 if data is invalid', async () => {
      expect.assertions(2);

      const fakeUserId = faker.datatype.uuid();

      axiosMock.get.mockResolvedValueOnce({
        status: 200,
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
          createdTimestamp: new Date().getTime(),
        },
      });

      const invalidData = {
        name: 123,
        email: 'invalidemail.com',
        document: '12345678910',
        password: '12345',
      };

      const response = await globalThis.request
        .put(`/users/${fakeUserId}`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .send(invalidData);

      expect(response.status).toEqual(400);
      expect(response.body.errors).toHaveLength(4);
    });

    it('returns 200 with the data', async () => {
      expect.assertions(2);

      const fakeUserId = faker.datatype.uuid();
      const fakeCreatedAt = new Date();

      axiosMock.get.mockResolvedValueOnce({
        status: 200,
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
          createdTimestamp: fakeCreatedAt.getTime(),
        },
      });

      axiosMock.put.mockResolvedValueOnce({
        status: 200,
        data: {},
      });

      const data = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        document: '69156949430',
        password: '123456',
      };

      const response = await globalThis.request
        .put(`/users/${fakeUserId}`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .send(data);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: fakeUserId,
        name: data.name,
        email: data.email,
        document: data.document,
        created_at: fakeCreatedAt.toISOString(),
      });
    });
  });

  describe('GET: /users/:id', () => {
    it("returns 404 if user doesn't exists", async () => {
      expect.assertions(2);

      axiosMock.get.mockRejectedValueOnce({
        response: {
          status: 404,
          data: {},
        },
      });

      const fakeUserId = faker.datatype.uuid();

      const response = await globalThis.request
        .get(`/users/${fakeUserId}`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .send();

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual('Usuário não encontrado.');
    });

    it('returns 200 with the user data', async () => {
      expect.assertions(2);

      const fakeUserId = faker.datatype.uuid();
      const fakeCreatedAt = new Date();

      const fakeData = {
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
        createdTimestamp: fakeCreatedAt.getTime(),
      };

      axiosMock.get.mockResolvedValueOnce({
        status: 200,
        data: fakeData,
      });

      const response = await globalThis.request
        .get(`/users/${fakeUserId}`)
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .send();

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: fakeUserId,
        name: `${fakeData.firstName} ${fakeData.lastName}`,
        email: fakeData.email,
        document: fakeData.attributes.document,
        created_at: fakeCreatedAt.toISOString(),
      });
    });
  });

  describe('GET: /users', () => {
    it('returns 200 with an array of users', async () => {
      expect.assertions(2);

      axiosMock.get.mockResolvedValueOnce({
        status: 200,
        data: [
          {
            id: faker.datatype.uuid(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            attributes: {
              document: '69156949430',
            },
            credentials: [{
              type: 'password',
              value: faker.random.alphaNumeric(6).toString(),
              temporary: false,
            }],
          },
          {
            id: faker.datatype.uuid(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            attributes: {
              document: '69156949430',
            },
            credentials: [{
              type: 'password',
              value: faker.random.alphaNumeric(6).toString(),
              temporary: false,
            }],
          },
        ],

      });

      const response = await globalThis.request
        .get('/users')
        .auth(fakeToken, { type: 'bearer' })
        .set('Content-Type', 'application/json')
        .send();

      expect(response.status).toEqual(200);
      expect(response.body.results).toHaveLength(2);
    });
  });
});
