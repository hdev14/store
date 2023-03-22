import { UserProps } from 'src/store/users/domain/User';

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
  document: string;
};

export type UpdateUserData = Partial<CreateUserData>;

interface IUserService {
  createUser(data: CreateUserData): Promise<UserProps>;

  updateUser(userId: string, data: UpdateUserData): Promise<UserProps>;

  getUser(userId: string): Promise<UserProps>;

  getUsers(): Promise<UserProps[]>;
}

export default IUserService;
