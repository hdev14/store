export type AuthPayload = {
  token: string;
  expired_at: Date;
}

interface IAuthService {
  auth(email: string, password: string): Promise<AuthPayload>;

  addPermission(user_id: string, permission: string): Promise<void>;

  removePermission(user_id: string, permission: string): Promise<void>;
}

export default IAuthService;
