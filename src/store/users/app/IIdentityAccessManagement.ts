import User from 'src/store/users/domain/User';

export type TokenPayload = {
  access_token: string;
  expires_in: number;
};

export type PaginationOptions = {
  limit: number;
  offset: number;
}

interface IIdentityAccessManagement {
  auth(email: string, password: string): Promise<TokenPayload>;

  registerUser(user: User): Promise<void>;

  updateUser(user: User): Promise<void>;

  getUser(user_id: string): Promise<User | null>;

  getUsers(pagination?: PaginationOptions): Promise<User[]>;

  addRole(user_id: string, role: string): Promise<void>;

  removeRole(user_id: string, role: string): Promise<void>;
}

export default IIdentityAccessManagement;
