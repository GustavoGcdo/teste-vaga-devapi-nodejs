import { ValidationFailedError } from '../../../infra/errors/validation-failed.error';
import { Result } from '../../../infra/models/result';
import { UseCase } from '../../../infra/models/use-case';
import { RemoveConnectorContract } from '../contracts/remove-connector.contract';
import { RemoveConnectorDto } from '../dtos/remove-connectors.dto';
import { Connector } from '../models/connector';
import { IConnectorRepository } from '../repositories/connector.repository.interface';

export class RemoveConnector implements UseCase<RemoveConnectorDto, Result<null>> {
  private connectorRepository: IConnectorRepository;

  constructor(connectorRepository: IConnectorRepository) {
    this.connectorRepository = connectorRepository;
  }

  async handle(dto: RemoveConnectorDto): Promise<Result<null>> {
    this.validate(dto);

    const foundConnector = await this.findConnector(dto.id);
    foundConnector.status = false;

    await this.connectorRepository.update(foundConnector);

    const result = new Result<null>(null, 'success on remove connector');
    return result;
  }

  private validate(dto: RemoveConnectorDto) {
    const contract = new RemoveConnectorContract(dto);
    const isInvalid = !contract.validate();
    if (isInvalid) {
      throw new ValidationFailedError('fail to remove connector', ...contract.reports);
    }
  }

  private async findConnector(id: string): Promise<Connector> {
    const foundConnector = await this.connectorRepository.findById(id);

    if (!foundConnector) {
      throw new ValidationFailedError('fail to remove connector', {
        name: 'id',
        message: 'connector is not found'
      });
    }

    return foundConnector;
  }
}
