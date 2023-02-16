import User from './User';

interface IUserRepository {
  getUserById(id: string): Promise<User>;

  addUser(user: User): Promise<User>;

  updateUser(user: User): Promise<User>;
}

export default IUserRepository;
