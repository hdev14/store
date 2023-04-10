import { faker } from '@faker-js/faker';
import { postMock } from '@mocks/axios';

describe("User's Integration Tests", () => {
  describe('POST: /users', () => {
    it('returns 400 if data is invalid', async () => {
      expect.assertions(2);

      const data = {
        name: 123,
        email: 'invalidemail.com',
        document: '12345678910',
        password: '12345',
      };

      const response = await globalThis.request
        .post('/users/')
        .set('Content-Type', 'application/json')
        .send(data);

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

      postMock.mockResolvedValueOnce({
        status: 200,
        data: {
          access_token: faker.random.alphaNumeric(10),
          expires_in: faker.datatype.number(),
        },
      }).mockRejectedValueOnce({
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
});
