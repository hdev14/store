import IIdentityAccessManagement from 'src/store/users/app/IIdentityAccessManagement';
import User from 'src/store/users/domain/User';

// TODO: add HttpClient
export default class KeyCloakIAM implements IIdentityAccessManagement {
  public async auth(email: string, password: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public async registerUser(_user: User): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public async updateUser(user: User): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async getUser(userId: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  public async getUsers(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  public async addRole(userId: string, role: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async addRoles(userId: string, roles: string[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async removeRole(userId: string, role: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async removeRoles(userId: string, role: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
