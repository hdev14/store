import IAuthService, { TokenPayload } from './IAuthService';

export default class AuthService implements IAuthService {
  public async auth(email: string, password: string): Promise<TokenPayload> {
    throw new Error('Method not implemented.');
  }

  public async addPermissions(userId: string, permissions: string[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async removePermissions(userId: string, permissions: string[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
