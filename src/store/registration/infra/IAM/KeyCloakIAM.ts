import IIdentityAccessManagement from '@registration/app/IIdentityAccessManagement';
import User from '@registration/domain/User';

// TODO: add keycloack sdk
export default class KeyCloakIAM implements IIdentityAccessManagement {
  public async registerUser(_user: User): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
