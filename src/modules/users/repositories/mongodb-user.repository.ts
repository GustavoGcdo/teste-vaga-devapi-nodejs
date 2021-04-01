import { MongoDBUserMapper } from '../mappers/mongodb-user.map';
import { User } from '../models/user';
import userSchema from '../schemas/user.schema';
import { IUserRepository } from './user.repository.interface';

export class MongoDBUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const userFound = await userSchema.findOne({ email });
    return userFound ? MongoDBUserMapper.toUser(userFound) : null;
  }

  async create(user: User): Promise<User> {
    const userCreated = await userSchema.create(user);
    return MongoDBUserMapper.toUser(userCreated);
  }
}
