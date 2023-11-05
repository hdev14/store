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

    const token_payload = await this.IAM.auth(email, password);

    const expired_at = new Date();
    expired_at.setSeconds(expired_at.getSeconds() + token_payload.expires_in);

    return {
      token: token_payload.access_token,
      expired_at,
    };
  }

  public async addPermission(user_id: string, permission: string): Promise<void> {
    const user = await this.IAM.getUser(user_id);

    if (!user) {
      throw new UserNotFoundError();
    }

    await this.IAM.addRole(user_id, permission);
  }

  public async removePermission(user_id: string, permission: string): Promise<void> {
    const user = await this.IAM.getUser(user_id);

    if (!user) {
      throw new UserNotFoundError();
    }

    await this.IAM.removeRole(user_id, permission);
  }
}
