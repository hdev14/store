import Validator from '@shared/utils/Validator';
import IAuthService, { AuthPayload } from './IAuthService';
import IIdentityAccessManagement from './IIdentityAccessManagement';
import UserNotFoundError from './UserNotFoundError';

export default class AuthService implements IAuthService {
  constructor(private readonly IAM: IIdentityAccessManagement) { }

  public async auth(email: string, password: string): Promise<AuthPayload> {
    Validator.setData({ email, password })
      .setRule('email', ['string', 'email'])
      .setRule('password', ['string', 'min:6'])
      .validate();

    const tokenPayload = await this.IAM.auth(email, password);

    const expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + tokenPayload.expiresIn);

    return {
      token: tokenPayload.accessToken,
      expiredAt,
    };
  }

  public async addPermission(userId: string, permission: string): Promise<void> {
    const user = await this.IAM.getUser(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    await this.IAM.addRole(userId, permission);
  }

  public async removePermission(userId: string, permission: string): Promise<void> {
    const user = await this.IAM.getUser(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    await this.IAM.removeRole(userId, permission);
  }
}
