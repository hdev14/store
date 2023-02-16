import User from '@registration/domain/User';

interface IIdentityAccessManagement {
  registerUser(user: User): Promise<any>;

  changeRole(userId: string, role: string): Promise<any>;
}

export default IIdentityAccessManagement;
