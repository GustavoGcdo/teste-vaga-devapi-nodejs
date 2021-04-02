import { ValidationFailedError } from '../../../infra/errors/validation-failed.error';
import { Result } from '../../../infra/models/result';
import { UseCase } from '../../../infra/models/use-case';
import { CreateConnectorContract } from '../contracts/create-connector.contract';
import { CreateConnectorDto } from '../dtos/create-connector.dto';
import { Connector } from '../models/connector';
import { IConnectorRepository } from '../repositories/connector.repository.interface';

export class CreateConnector implements UseCase<CreateConnectorDto, Result<Connector>> {
  private connectorRepository: IConnectorRepository;

  constructor(connectorRepository: IConnectorRepository) {
    this.connectorRepository = connectorRepository;
  }

  async handle(dto: CreateConnectorDto): Promise<Result<Connector>> {
    this.validate(dto);

    const initialStatus = dto.status === undefined ? true : dto.status;

    const connectorToCreate = {
      name: dto.name,
      baseURL: dto.baseURL,
      category: dto.category,
      privacy: dto.privacy,
      status: initialStatus,
      description: dto.description,
      type: dto.type
    } as Connector;

    const connectorCreated = await this.connectorRepository.create(connectorToCreate);
    const result = new Result<Connector>(connectorCreated, 'success on create connector');
    return result;
  }

  private validate(dto: CreateConnectorDto) {
    const contract = new CreateConnectorContract(dto);
    const isInvalid = !contract.validate();
    if (isInvalid) {
      throw new ValidationFailedError('fail to create connector', ...contract.reports);
    }
  }
}
