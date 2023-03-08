import User from 'src/store/users/domain/User';

interface IIdentityAccessManagement {
  auth(email: string, password: string): Promise<any>;

  registerUser(user: User): Promise<void>;

  updateUser(user: User): Promise<void>;

  getUser(userId: string): Promise<User>;

  getUsers(): Promise<User[]>;

  addRole(userId: string, role: string): Promise<void>;

  addRoles(userId: string, roles: string[]): Promise<void>;

  removeRole(userId: string, role: string): Promise<void>;

  removeRoles(userId: string, role: string): Promise<void>;
}

export default IIdentityAccessManagement;
