export interface IEncriptService {
  encript(value: string): Promise<string>;
}
