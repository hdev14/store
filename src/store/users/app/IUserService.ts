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

  updateUser(user_id: string, data: UpdateUserData): Promise<UserProps>;

  getUser(user_id: string): Promise<UserProps>;

  getUsers(): Promise<UserProps[]>;
}

export default IUserService;
