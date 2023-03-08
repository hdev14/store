import User from 'src/store/users/domain/User';

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
};

export type UpdateUserData = Partial<CreateUserData>;

interface IUserService {
  createUser(data: CreateUserData): Promise<User>;

  updateUser(userId: string, data: UpdateUserData): Promise<User>;

  getUser(userId: string): Promise<User>;

  getUsers(): Promise<User[]>;

  deleteUser(userId: string): Promise<void>;
}

export default IUserService;
