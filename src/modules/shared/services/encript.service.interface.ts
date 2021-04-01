import md5 from 'md5';
import { IEncriptService } from './encript.service';

export class EncriptService implements IEncriptService {
  async encript(value: string): Promise<string> {
    const encriptedValue = md5(value);
    return encriptedValue;
  }
}
