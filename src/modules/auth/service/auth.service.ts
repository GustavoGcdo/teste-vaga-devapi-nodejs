import { sign } from 'jsonwebtoken';
import config from '../../../config';
import { Payload } from '../models/payload';
import { IAuthService } from './auth.service.interface';

export class AuthService implements IAuthService {
  async generateToken(payload: Payload): Promise<string> {
    const token = await sign(payload, config.SALT_KEY);
    return token;
  }
}
