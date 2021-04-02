/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connector } from '../models/connector';
export class ConnectorMapper {
  public static toDomain(raw: any): Connector {
    return {
      id: raw._id,
      baseURL: raw.baseURL,
      category: raw.category,
      description: raw.description,
      name: raw.name,
      privacy: raw.privacy,
      status: raw.status,
      type: raw.type
    };
  }
}
