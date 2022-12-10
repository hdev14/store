/* eslint-disable no-unused-vars */
import User from '@registration/domain/User';

// IAM
interface IIdentityAccessManagement {
  registerUser(user: User): Promise<any>;
  changeRole(userId: string, role: string): Promise<any>;
}

export default IIdentityAccessManagement;
