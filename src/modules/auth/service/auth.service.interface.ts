import { Payload } from '../models/payload';

export interface IAuthService {
  verifyToken(token: string): Promise<Payload>;
  generateToken(payload: Payload): Promise<string>;
}
