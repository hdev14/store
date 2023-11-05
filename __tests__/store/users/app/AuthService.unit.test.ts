import { faker } from '@faker-js/faker';
import ValidationError from '@shared/errors/ValidationError';
import AuthService from '@users/app/AuthService';
import IIdentityAccessManagement from '@users/app/IIdentityAccessManagement';
import UserNotFoundError from '@users/app/UserNotFoundError';
import User from '@users/domain/User';
import { mock } from 'jest-mock-extended';

describe("AuthService's unit tests", () => {
  const IAMMock = mock<IIdentityAccessManagement>();
  const authService = new AuthService(IAMMock);

  IAMMock.auth.mockResolvedValue({
    access_token: faker.random.alphaNumeric(10),
    expires_in: parseInt(faker.datatype.number().toString(), 10),
  });

  describe('AuthService.auth()', () => {
    it('throws an ValidationError if email is invalid', () => {
      expect.assertions(2);

      const invalidEmail = 'invalidemail.com';

      return authService.auth(invalidEmail, faker.datatype.string()).catch((e: any) => {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0]).toEqual({
          field: 'email',
          messages: ['The field email must be a valid email address.'],
        });
      });
    });

    it("throws an ValidationError if password doesn't have length greated than 6 caracters", () => {
      expect.assertions(2);

      const smallPassword = faker.datatype.string(5);

      return authService.auth(faker.internet.email(), smallPassword).catch((e: any) => {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0]).toEqual({
          field: 'password',
          messages: ['The text must have more or equal to 6 caracters.'],
        });
      });
    });

    it('calls IAM.auth method with correct params', async () => {
      expect.assertions(1);

      const fakeEmail = faker.internet.email();
      const fakePassword = faker.datatype.string(6);

      await authService.auth(fakeEmail, fakePassword);

      expect(IAMMock.auth).toHaveBeenCalledWith(fakeEmail, fakePassword);
    });

    it('returns a AuthPayload', async () => {
      expect.assertions(2);

      const seconds = parseInt(faker.datatype.number().toString(), 10);

      const fakeTokenPayload = {
        accessToken: faker.random.alphaNumeric(10),
        expiresIn: seconds,
      };

      IAMMock.auth.mockResolvedValueOnce(fakeTokenPayload);

      const payload = await authService.auth(faker.internet.email(), faker.datatype.string(6));

      expect(payload.token).toEqual(fakeTokenPayload.accessToken);
      expect(payload.expired_at).toBeInstanceOf(Date);
    });
  });

  describe('AuthService.addPermission()', () => {
    it("throws an UserNotFoundError if user doesn't exist", () => {
      expect.assertions(2);

      IAMMock.getUser.mockResolvedValueOnce(null);
      const fakeUserId = faker.datatype.uuid();
      const fakePermission = faker.word.verb();

      return authService.addPermission(fakeUserId, fakePermission).catch((e: any) => {
        expect(e).toBeInstanceOf(UserNotFoundError);
        expect(e.message).toEqual('Usuário não encontrado.');
      });
    });

    it('calls IAM.addRole with correct params', async () => {
      expect.assertions(1);

      IAMMock.getUser.mockResolvedValueOnce({} as User);
      const fakeUserId = faker.datatype.uuid();
      const fakePermission = faker.word.verb();

      await authService.addPermission(fakeUserId, fakePermission);

      expect(IAMMock.addRole).toHaveBeenCalledWith(fakeUserId, fakePermission);
    });
  });

  describe('AuthService.removePermission()', () => {
    it("throws an UserNotFoundError if user doesn't exist", () => {
      expect.assertions(2);

      IAMMock.getUser.mockResolvedValueOnce(null);
      const fakeUserId = faker.datatype.uuid();
      const fakePermission = faker.word.verb();

      return authService.removePermission(fakeUserId, fakePermission).catch((e: any) => {
        expect(e).toBeInstanceOf(UserNotFoundError);
        expect(e.message).toEqual('Usuário não encontrado.');
      });
    });

    it('calls IAM.removeRole with correct params', async () => {
      expect.assertions(1);

      IAMMock.getUser.mockResolvedValueOnce({} as User);
      const fakeUserId = faker.datatype.uuid();
      const fakePermission = faker.word.verb();

      await authService.removePermission(fakeUserId, fakePermission);

      expect(IAMMock.removeRole).toHaveBeenCalledWith(fakeUserId, fakePermission);
    });
  });
});
