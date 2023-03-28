import { faker } from '@faker-js/faker';
import { mock, mockClear } from 'jest-mock-extended';
import ValidationError from '@shared/errors/ValidationError';
import IIdentityAccessManagement from '@users/app/IIdentityAccessManagement';
import UserService from '@users/app/UserService';

describe("UserService's unit tests", () => {
  const IAMMock = mock<IIdentityAccessManagement>();
  const userService = new UserService(IAMMock);

  beforeEach(() => {
    mockClear(IAMMock);
  });

  describe('UserService.createUser()', () => {
    it('throws a ValidationError if data is invalid', async () => {
      const data: any = {
        name: 123,
        email: 'invalidemail.com',
        password: 123,
        document: 123,
      };

      try {
        await userService.createUser(data);
      } catch (e: any) {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0].field).toEqual('name');
        expect(e.errors[1].field).toEqual('email');
        expect(e.errors[2].field).toEqual('document');
        expect(e.errors[3].field).toEqual('password');
      }
    });
  });

  test.todo('UserService.updateUser()');

  test.todo('UserService.getUser()');

  test.todo('UserService.getUsers()');
});
