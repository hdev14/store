import { faker } from '@faker-js/faker';
import ValidationError from '@shared/errors/ValidationError';
import IIdentityAccessManagement from '@users/app/IIdentityAccessManagement';
import UserNotFoundError from '@users/app/UserNotFoundError';
import UserService from '@users/app/UserService';
import CPF from '@users/domain/CPF';
import User from '@users/domain/User';
import { mock, mockClear } from 'jest-mock-extended';

describe("UserService's unit tests", () => {
  const IAMMock = mock<IIdentityAccessManagement>();
  const userService = new UserService(IAMMock);

  beforeEach(() => {
    mockClear(IAMMock);
  });

  describe('UserService.createUser()', () => {
    it('throws a ValidationError if data is invalid', () => {
      const data: any = {
        name: 123,
        email: 'invalidemail.com',
        password: 123,
        document: 123,
      };

      return userService.createUser(data).catch((e: any) => {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0].field).toEqual('name');
        expect(e.errors[1].field).toEqual('email');
        expect(e.errors[2].field).toEqual('document');
        expect(e.errors[3].field).toEqual('password');
      });
    });

    it('calls IAM.registerUser to register a new user', async () => {
      expect.assertions(2);

      await userService.createUser({
        document: '69156949430',
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(6),
      });

      expect(IAMMock.registerUser).toHaveBeenCalled();
      expect(IAMMock.registerUser.mock.calls[0][0]).toBeInstanceOf(User);
    });

    it('returns a new user', async () => {
      expect.assertions(6);

      const data = {
        document: '69156949430',
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(6),
      };

      const user = await userService.createUser(data);

      expect(user.id).toBeTruthy();
      expect(user.name).toEqual(data.name);
      expect(user.email).toEqual(data.email);
      expect(user.document).toEqual(data.document);
      expect(user.created_at).toBeInstanceOf(Date);
      expect(user.password).toBeUndefined();
    });
  });

  describe('UserService.updateUser()', () => {
    it("throws a UserNotFoundError if user doesn't exist", () => {
      expect.assertions(1);

      IAMMock.getUser.mockResolvedValueOnce(null);

      const fakeUserId = faker.datatype.uuid();
      const data = {
        document: '69156949430',
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(6),
      };

      return userService.updateUser(fakeUserId, data).catch((e: any) => {
        expect(e).toBeInstanceOf(UserNotFoundError);
      });
    });

    it('calls IAM.updateUser with correct params', async () => {
      expect.assertions(1);

      const fakeUser = new User({
        id: faker.datatype.uuid(),
        name: faker.name.fullName(),
        email: faker.internet.email(),
        document: '69156949430',
        password: faker.random.alphaNumeric(6),
        created_at: new Date(),
      });

      IAMMock.getUser.mockResolvedValueOnce(fakeUser);

      const fakeUserId = faker.datatype.uuid();
      const data = {
        document: '69156949430',
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(6),
      };

      await userService.updateUser(fakeUserId, data);

      expect(IAMMock.updateUser).toHaveBeenCalledWith({
        ...fakeUser,
        ...data,
        document: new CPF(data.document),
      });
    });

    it('throws a ValidationError if data is invalid', () => {
      expect.assertions(5);

      const fakeUser = new User({
        id: faker.datatype.uuid(),
        name: faker.name.fullName(),
        email: faker.internet.email(),
        document: '69156949430',
        password: faker.random.alphaNumeric(6),
        created_at: new Date(),
      });

      IAMMock.getUser.mockResolvedValueOnce(fakeUser);

      const fakeUserId = faker.datatype.uuid();
      const data: any = {
        name: 123,
        email: 'invalidemail.com',
        password: 123,
        document: 123,
      };

      return userService.updateUser(fakeUserId, data).catch((e: any) => {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0].field).toEqual('name');
        expect(e.errors[1].field).toEqual('email');
        expect(e.errors[2].field).toEqual('document');
        expect(e.errors[3].field).toEqual('password');
      });
    });

    it('returns a updated user', async () => {
      expect.assertions(4);

      const fakeUser = new User({
        id: faker.datatype.uuid(),
        name: faker.name.fullName(),
        email: faker.internet.email(),
        document: '69156949430',
        password: faker.random.alphaNumeric(6),
        created_at: new Date(),
      });

      IAMMock.getUser.mockResolvedValueOnce(fakeUser);

      const fakeUserId = faker.datatype.uuid();
      const data = {
        document: '69156949430',
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(6),
      };

      const user = await userService.updateUser(fakeUserId, data);

      expect(user.name).toEqual(data.name);
      expect(user.email).toEqual(data.email);
      expect(user.document).toEqual(data.document);
      expect(user.password).toBeUndefined();
    });
  });

  describe('UserService.getUser()', () => {
    it('throws a UserNotFoundError if IAM.getUser returns NULL', () => {
      expect.assertions(1);

      const fakeUserId = faker.datatype.uuid();

      IAMMock.getUser.mockResolvedValueOnce(null);

      return userService.getUser(fakeUserId).catch((error) => {
        expect(error).toBeInstanceOf(UserNotFoundError);
      });
    });

    it('returns a user data', async () => {
      expect.assertions(4);

      const fakeUserId = faker.datatype.uuid();

      const fakeUser = new User({
        id: faker.datatype.uuid(),
        name: faker.name.fullName(),
        email: faker.internet.email(),
        document: '69156949430',
        password: faker.random.alphaNumeric(6),
        created_at: new Date(),
      });

      IAMMock.getUser.mockResolvedValueOnce(fakeUser);

      const user = await userService.getUser(fakeUserId);

      expect(user.name).toEqual(fakeUser.name);
      expect(user.email).toEqual(fakeUser.email);
      expect(user.document).toEqual(fakeUser.document.value);
      expect(user.password).toBeUndefined();
    });
  });

  describe('UserService.getUsers()', () => {
    it('returns an array of user data', async () => {
      expect.assertions(9);

      const fakeUsers = [
        new User({
          id: faker.datatype.uuid(),
          name: faker.name.fullName(),
          email: faker.internet.email(),
          document: '69156949430',
          password: faker.random.alphaNumeric(6),
          created_at: new Date(),
        }),
        new User({
          id: faker.datatype.uuid(),
          name: faker.name.fullName(),
          email: faker.internet.email(),
          document: '69156949430',
          password: faker.random.alphaNumeric(6),
          created_at: new Date(),
        }),
      ];

      IAMMock.getUsers.mockResolvedValueOnce(fakeUsers);

      const users = await userService.getUsers();

      expect(users).toHaveLength(2);

      expect(users[0].name).toEqual(fakeUsers[0].name);
      expect(users[0].email).toEqual(fakeUsers[0].email);
      expect(users[0].document).toEqual(fakeUsers[0].document.value);
      expect(users[0].password).toBeUndefined();

      expect(users[1].name).toEqual(fakeUsers[1].name);
      expect(users[1].email).toEqual(fakeUsers[1].email);
      expect(users[1].document).toEqual(fakeUsers[1].document.value);
      expect(users[1].password).toBeUndefined();
    });
  });
});
