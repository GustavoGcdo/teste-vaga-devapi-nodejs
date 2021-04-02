import mongoose from 'mongoose';
import { SignupDto } from '../../src/modules/auth/dtos/signup.dto';
import { AuthService } from '../../src/modules/auth/service/auth.service';
import { Signup } from '../../src/modules/auth/use-cases/signup';
import { EncriptService } from '../../src/modules/shared/services/encript.service.interface';
import { MongoDBUserRepository } from '../../src/modules/users/repositories/mongodb-user.repository';

export function getRamdomValidEmail() {
  const randomNumber = Math.floor(Math.random() * 100 + 1);
  return `user${randomNumber}@email.com`;
}

export async function deleteUser(id: string) {
  const objcID = mongoose.Types.ObjectId(id);
  await mongoose.connection.collection('users').findOneAndDelete({ _id: objcID });
}

export async function getValidTokenAndUser() {
  const signup = new Signup(new MongoDBUserRepository(), new EncriptService(), new AuthService());
  const validUserDto: SignupDto = {
    email: getRamdomValidEmail(),
    password: '123456'
  };
  const result = await signup.handle(validUserDto);
  const { token, user } = result.data;
  return { token, user };
}
