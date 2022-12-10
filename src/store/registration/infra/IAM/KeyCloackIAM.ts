import IIdentityAccessManagement from '@registration/app/IIdentityAccessManagement';
import User from '@registration/domain/User';

// TODO: add keycloack sdk
export default class KeyCloackIAM implements IIdentityAccessManagement {
  public async registerUser(_user: User): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public async changeRole(_userId: string, _role: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
