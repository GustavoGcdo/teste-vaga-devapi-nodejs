import { PaginateOptions } from '../../shared/models/paginate-options';
import { PaginateResult } from '../../shared/models/paginate-result';
import { ConnectorMapper } from '../mappers/connector.mapper';
import { Connector } from '../models/connector';
import { FilterConnector } from '../models/filter-connector';
import connectorSchema from '../schemas/connector.schema';
import { IConnectorRepository } from './connector.repository.interface';

export class MongoDBConnectorRepository implements IConnectorRepository {
  async create(connector: Connector): Promise<Connector> {
    const connectorCreated = await connectorSchema.create(connector);
    return ConnectorMapper.toDomain(connectorCreated);
  }

  async find(filter: FilterConnector, paginateOptions: PaginateOptions): Promise<PaginateResult<Connector>> {
    const { skip, limit } = paginateOptions;

    const query: any = {};

    if (filter.name) {
      query.name = { $regex: `${filter.name}` };
    }

    if (filter.category) {
      query.category = filter.category;
    }

    if (filter.type) {
      query.type = filter.type;
    }

    if (filter.privacy) {
      query.privacy = filter.privacy;
    }

    if (filter.status) {
      query.status = filter.status;
    }

    const documentsFound = await connectorSchema.find(query).skip(skip).limit(limit);
    const count = await connectorSchema.countDocuments(query);

    const connectors = documentsFound.map((doc) => ConnectorMapper.toDomain(doc));

    return {
      results: connectors,
      total: count
    };
  }
}
