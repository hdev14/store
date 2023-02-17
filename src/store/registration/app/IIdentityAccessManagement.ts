import User from '@registration/domain/User';

interface IIdentityAccessManagement {
  registerUser(user: User): Promise<any>;
}

export default IIdentityAccessManagement;
