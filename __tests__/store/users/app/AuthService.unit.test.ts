import { faker } from '@faker-js/faker';
import ValidationError from '@shared/errors/ValidationError';
import AuthService from '@users/app/AuthService';
import IIdentityAccessManagement from '@users/app/IIdentityAccessManagement';
import { mock } from 'jest-mock-extended';

describe("AuthService's unit tests", () => {
  const IAMMock = mock<IIdentityAccessManagement>();
  const authService = new AuthService(IAMMock);

  IAMMock.auth.mockResolvedValue({
    accessToken: faker.random.alphaNumeric(10),
    expiresIn: parseInt(faker.datatype.number().toString(), 10),
  });

  describe('AuthService.auth()', () => {
    it('throws an ValidationError if email is invalid', async () => {
      expect.assertions(2);

      const invalidEmail = 'invalidemail.com';

      try {
        await authService.auth(invalidEmail, faker.datatype.string());
      } catch (e: any) {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0]).toEqual({
          field: 'email',
          messages: ['The field email must be a valid email address.'],
        });
      }
    });

    it("throws an ValidationError if password doesn't have length greated than 6 caracters", async () => {
      expect.assertions(2);

      const smallPassword = faker.datatype.string(5);

      try {
        await authService.auth(faker.internet.email(), smallPassword);
      } catch (e: any) {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0]).toEqual({
          field: 'password',
          messages: ['The text must have more or equal to 6 caracters.'],
        });
      }
    });

    it('calls IAM.auth method with correct params', async () => {
      expect.assertions(1);

      const fakeEmail = faker.internet.email();
      const fakePassword = faker.datatype.string(6);

      await authService.auth(fakeEmail, fakePassword);

      expect(IAMMock.auth).toHaveBeenCalledWith(fakeEmail, fakePassword);
    });

    it('returns a AuthPayload', async () => {
      expect.assertions(1);

      const seconds = parseInt(faker.datatype.number().toString(), 10);

      const fakeTokenPayload = {
        accessToken: faker.random.alphaNumeric(10),
        expiresIn: seconds,
      };

      IAMMock.auth.mockResolvedValueOnce(fakeTokenPayload);

      const expectedExpiredAt = new Date();
      expectedExpiredAt.setSeconds(expectedExpiredAt.getSeconds() + seconds);

      const payload = await authService.auth(faker.internet.email(), faker.datatype.string(6));

      expect(payload).toEqual({
        token: fakeTokenPayload.accessToken,
        expiredAt: expectedExpiredAt,
      });
    });
  });
});
