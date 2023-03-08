export type TokenPayload = {
  token: string;
  expiredAt: number;
}

interface IAuthService {
  auth(email: string, password: string): Promise<TokenPayload>;

  addPermissions(userId: string, permissions: string[]): Promise<void>;

  removePermissions(userId: string, permissions: string[]): Promise<void>;
}

export default IAuthService;
