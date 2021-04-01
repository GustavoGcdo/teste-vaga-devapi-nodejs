import { Payload } from '../models/payload';

export interface IAuthService {
  generateToken(payload: Payload): Promise<string>;
}
