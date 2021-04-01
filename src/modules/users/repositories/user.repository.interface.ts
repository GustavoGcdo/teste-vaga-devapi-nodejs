import { User } from '../models/user';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  findByEmailAndPassword(email: string, password: string): Promise<User | null>;
}
