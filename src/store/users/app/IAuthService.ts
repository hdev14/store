export type AuthPayload = {
  token: string;
  expiredAt: Date;
}

interface IAuthService {
  auth(email: string, password: string): Promise<AuthPayload>;

  addPermission(userId: string, permission: string): Promise<void>;

  removePermission(userId: string, permission: string): Promise<void>;
}

export default IAuthService;
