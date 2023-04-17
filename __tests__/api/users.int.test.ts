import { faker } from '@faker-js/faker';
import { postMock, getMock, putMock } from '@mocks/axios';

describe("User's Integration Tests", () => {
  beforeAll(() => {
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
    putMock.mockClear();
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

      postMock.mockRejectedValueOnce({
        response: {
          status: 400,
          data: {},
        },
      });

      const response = await globalThis.request
        .post('/users/')
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

      postMock.mockResolvedValueOnce({});

      const response = await globalThis.request
        .post('/users/')
        .set('Content-Type', 'application/json')
        .send(data);

      expect(response.status).toEqual(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toEqual(data.name);
      expect(response.body.email).toEqual(data.email);
      expect(response.body.document).toEqual(data.document);
      expect(response.body.password).toBeUndefined();
      expect(response.body.createdAt).toBeTruthy();
    });
  });

  describe('PUT: /users/:id', () => {
    it("returns 404 if user doesn't exists", async () => {
      expect.assertions(2);

      getMock.mockRejectedValueOnce({
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
        .set('Content-Type', 'application/json')
        .send(data);

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual('Usuário não encontrado.');
    });

    it('returns 400 if data is invalid', async () => {
      expect.assertions(2);

      const fakeUserId = faker.datatype.uuid();

      getMock.mockResolvedValueOnce({
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
        .set('Content-Type', 'application/json')
        .send(invalidData);

      expect(response.status).toEqual(400);
      expect(response.body.errors).toHaveLength(4);
    });

    it('returns 200 with the data', async () => {
      expect.assertions(2);

      const fakeUserId = faker.datatype.uuid();
      const fakeCreatedAt = new Date();

      getMock.mockResolvedValueOnce({
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

      putMock.mockResolvedValueOnce({
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
        .set('Content-Type', 'application/json')
        .send(data);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: fakeUserId,
        name: data.name,
        email: data.email,
        document: data.document,
        createdAt: fakeCreatedAt.toISOString(),
      });
    });
  });

  describe('GET: /users/:id', () => {
    it("returns 404 if user doesn't exists", async () => {
      expect.assertions(2);

      getMock.mockRejectedValueOnce({
        response: {
          status: 404,
          data: {},
        },
      });

      const fakeUserId = faker.datatype.uuid();

      const response = await globalThis.request
        .get(`/users/${fakeUserId}`)
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

      getMock.mockResolvedValueOnce({
        status: 200,
        data: fakeData,
      });

      const response = await globalThis.request
        .get(`/users/${fakeUserId}`)
        .set('Content-Type', 'application/json')
        .send();

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: fakeUserId,
        name: `${fakeData.firstName} ${fakeData.lastName}`,
        email: fakeData.email,
        document: fakeData.attributes.document,
        createdAt: fakeCreatedAt.toISOString(),
      });
    });
  });
});
