import e from 'express';
import User from 'src/store/users/domain/User';

export type TokenPayload = {
  accessToken: string;
  expiresIn: number;
};

export type PaginationOptions = {
  limit: number;
  offset: number;
}

interface IIdentityAccessManagement {
  auth(email: string, password: string): Promise<TokenPayload>;

  registerUser(user: User): Promise<void>;

  updateUser(user: User): Promise<void>;

  getUser(userId: string): Promise<User>;

  getUsers(pagination?: PaginationOptions): Promise<User[]>;

  addRole(userId: string, role: string): Promise<void>;

  removeRole(userId: string, role: string): Promise<void>;
}

export default IIdentityAccessManagement;
