import { PaginateOptions } from '../../shared/models/paginate-options';
import { PaginateResult } from '../../shared/models/paginate-result';
import { Connector } from '../models/connector';
import { FilterConnector } from '../models/filter-connector';

export interface IConnectorRepository {
  find(
    filter: FilterConnector,
    paginateOptions: PaginateOptions
  ): Promise<PaginateResult<Connector>>;

  create(connector: Connector): Promise<Connector>;
}
