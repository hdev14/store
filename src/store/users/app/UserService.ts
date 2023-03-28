import crypto from 'crypto';
import User, { UserProps } from '@users/domain/User';
import IIdentityAccessManagement from './IIdentityAccessManagement';
import IUserService, { CreateUserData, UpdateUserData } from './IUserService';

// TODO: add implementation
export default class UserService implements IUserService {
  constructor(private readonly IAM: IIdentityAccessManagement) {}

  public async createUser(data: CreateUserData): Promise<UserProps> {
    const user = new User({
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      document: data.document,
      password: data.password,
      createdAt: new Date(),
    });

    return {} as any;
  }

  public async updateUser(userId: string, data: UpdateUserData): Promise<UserProps> {
    throw new Error('Method not implemented.');
  }

  public async getUser(userId: string): Promise<UserProps> {
    throw new Error('Method not implemented.');
  }

  public async getUsers(): Promise<UserProps[]> {
    throw new Error('Method not implemented.');
  }
}
