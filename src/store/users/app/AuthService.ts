import IAuthService, { AuthPayload } from './IAuthService';
import IIdentityAccessManagement from './IIdentityAccessManagement';

// TODO: add implementation
export default class AuthService implements IAuthService {
  constructor(private readonly IAM: IIdentityAccessManagement) { }

  public async auth(email: string, password: string): Promise<AuthPayload> {
    throw new Error('Method not implemented.');
  }

  public async addPermission(userId: string, permission: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async removePermission(userId: string, permission: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
