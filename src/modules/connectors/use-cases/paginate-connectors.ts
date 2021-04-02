import { ValidationFailedError } from '../../../infra/errors/validation-failed.error';
import { Result } from '../../../infra/models/result';
import { UseCase } from '../../../infra/models/use-case';
import { PaginateOptions } from '../../shared/models/paginate-options';
import { PaginateConnectorsContract } from '../contracts/paginate-connectors.contract';
import { PaginateConnectorsDto } from '../dtos/paginate-connectors.dto';
import { Connector } from '../models/connector';
import { FilterConnector } from '../models/filter-connector';
import { IConnectorRepository } from '../repositories/connector.repository.interface';

type ConnectorPaginate = {
  results: Connector[];
  total: number;
  limit: number;
  currentPage: number;
};

export class PaginateConnectors
implements UseCase<PaginateConnectorsDto, Result<ConnectorPaginate>> {
  private connectorRepository: IConnectorRepository;

  constructor(connectorRepository: IConnectorRepository) {
    this.connectorRepository = connectorRepository;
  }

  async handle(dto: PaginateConnectorsDto): Promise<Result<ConnectorPaginate>> {
    this.validate(dto);

    const filter = this.extractFilter(dto);
    const paginateOptions = this.extractPaginateOptions(dto);

    const paginateResult = await this.connectorRepository.find(filter, paginateOptions);

    const connectorPaginate: ConnectorPaginate = {
      currentPage: paginateOptions.page,
      limit: paginateOptions.limit,
      results: paginateResult.results,
      total: paginateResult.total
    };

    const result = new Result<ConnectorPaginate>(connectorPaginate, 'success on find connectors');
    return result;
  }

  private validate(dto: PaginateConnectorsDto) {
    const contract = new PaginateConnectorsContract(dto);
    const isInvalid = !contract.validate();
    if (isInvalid) {
      throw new ValidationFailedError('fail to find connectors', ...contract.reports);
    }
  }

  private extractFilter(dto: PaginateConnectorsDto): FilterConnector {
    const defaultStatusValue = true;
    const statusInBoolean = dto.status === 'true';
    const filterStatus = dto.status === undefined ? defaultStatusValue : statusInBoolean;

    return {
      category: dto.category,
      name: dto.name,
      privacy: dto.privacy,
      type: dto.type,
      status: filterStatus
    };
  }

  private extractPaginateOptions(dto: PaginateConnectorsDto): PaginateOptions {
    const { page, limit } = dto;
    const pageNumber = page ? parseInt(page) : 1;
    const limitNumber = limit ? parseInt(limit) : 10;

    const skip = (pageNumber - 1) * limitNumber;

    return {
      limit: limitNumber,
      page: pageNumber,
      skip
    };
  }
}
