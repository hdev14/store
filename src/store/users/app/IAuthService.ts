export type AuthPayload = {
  token: string;
  expiredAt: Date;
}

interface IAuthService {
  auth(email: string, password: string): Promise<AuthPayload>;

  addPermissions(userId: string, permissions: string[]): Promise<void>;

  removePermissions(userId: string, permissions: string[]): Promise<void>;
}

export default IAuthService;
