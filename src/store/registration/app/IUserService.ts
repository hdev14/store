import User from '@registration/domain/User';

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
};

export type UpdateUserData = Partial<CreateUserData>;

// TODO: change return
interface IUserService {
  createUser(data: CreateUserData): Promise<User>;

  updateUser(data: UpdateUserData): Promise<User>;
}

export default IUserService;
