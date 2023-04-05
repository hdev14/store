import { faker } from '@faker-js/faker';
import { postMock } from '@mocks/axios';

describe("Auth's Integration Tests", () => {
  describe('POST: /auth', () => {
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
});
