/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '../models/user';
export class MongoDBUserMapper {
  public static toUser(raw: any): User {
    return {
      id: raw._id,
      email: raw.email,
      password: raw.password
    };
  }
}
