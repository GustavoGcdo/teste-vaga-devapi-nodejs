import { Privacy } from './privacy';
import { Type } from './type';

export interface Connector {
  id: string;
  name: string;
  type: Type;
  privacy: Privacy;
  baseURL: string;
  category: string;
  description: string;
  status: boolean;
}
