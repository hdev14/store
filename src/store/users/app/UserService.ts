import User from 'src/store/users/domain/User';
import IUserService, { CreateUserData, UpdateUserData } from './IUserService';

export default class UserService implements IUserService {
  public async createUser(data: CreateUserData): Promise<User> {
    throw new Error('Method not implemented.');
  }

  public async updateUser(userId: string, data: UpdateUserData): Promise<User> {
    throw new Error('Method not implemented.');
  }

  public async getUser(userId: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  public async getUsers(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  public async deleteUser(userId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
