import User, { UserProps } from '@users/domain/User';
import crypto from 'crypto';
import IIdentityAccessManagement from './IIdentityAccessManagement';
import IUserService, { CreateUserData, UpdateUserData } from './IUserService';
import UserNotFoundError from './UserNotFoundError';

export default class UserService implements IUserService {
  constructor(private readonly IAM: IIdentityAccessManagement) {}

  public async createUser(data: CreateUserData): Promise<UserProps> {
    const user = new User({
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      document: data.document,
      password: data.password,
      created_at: new Date(),
    });

    await this.IAM.registerUser(user);

    return user.toObject();
  }

  public async updateUser(user_id: string, data: UpdateUserData): Promise<UserProps> {
    const user = await this.IAM.getUser(user_id);

    if (!user) {
      throw new UserNotFoundError();
    }

    const updated_user = new User({ ...user.toObject(), ...data });

    await this.IAM.updateUser(updated_user);

    return updated_user.toObject();
  }

  public async getUser(user_id: string): Promise<UserProps> {
    const user = await this.IAM.getUser(user_id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user.toObject();
  }

  public async getUsers(): Promise<UserProps[]> {
    const users = await this.IAM.getUsers();

    const results: UserProps[] = [];

    for (const user of users) {
      results.push(user.toObject());
    }

    return results;
  }
}
