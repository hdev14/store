import IUserRepository from '@registration/domain/IUserRepository';
import User from '@registration/domain/User';

export default class PrismaUserrepository implements IUserRepository {
  public async getUserById(id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  public async addUser(user: User): Promise<User> {
    throw new Error('Method not implemented.');
  }

  public async updateUser(user: User): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
