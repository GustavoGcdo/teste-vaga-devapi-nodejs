import { sign, verify } from 'jsonwebtoken';
import config from '../../../config';
import { Payload } from '../models/payload';
import { IAuthService } from './auth.service.interface';

export class AuthService implements IAuthService {
  async generateToken(payload: Payload): Promise<string> {
    const token = await sign(payload, config.SALT_KEY);
    return token;
  }

  async verifyToken(token: string): Promise<Payload> {
    const tokenReplace = this.replaceToken(token);
    const data = verify(tokenReplace, config.SALT_KEY) as Payload;
    return data;
  }

  private replaceToken(token: string) {
    const tokenReplace = token.replace('Bearer ', '');
    return tokenReplace;
  }
}
