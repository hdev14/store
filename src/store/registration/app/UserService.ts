import User from '@registration/domain/User';
import IUserService, { CreateUserData } from './IUserService';

export default class UserService implements IUserService {
  public async createUser(_data: CreateUserData): Promise<User> {
    throw new Error('Method not implemented.');
  }

  public async updateUser(_data: Partial<CreateUserData>): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
