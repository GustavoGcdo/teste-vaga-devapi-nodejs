import { ConnectorMapper } from '../mappers/connector.mapper';
import { Connector } from '../models/connector';
import connectorSchema from '../schemas/connector.schema';
import { IConnectorRepository } from './connector.repository.interface';

export class MongoDBConnectorRepository implements IConnectorRepository {
  async create(connector: Connector): Promise<Connector> {
    const connectorCreated = await connectorSchema.create(connector);
    return ConnectorMapper.toDomain(connectorCreated);
  }
}
