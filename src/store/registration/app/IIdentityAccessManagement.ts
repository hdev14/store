import User from '@registration/domain/User';

export type TokenPayload = {
  token: string;
  expiredAt: number;
}

interface IIdentityAccessManagement {
  auth(email: string, password: string): Promise<TokenPayload>;

  registerUser(user: User): Promise<void>;
}

export default IIdentityAccessManagement;
