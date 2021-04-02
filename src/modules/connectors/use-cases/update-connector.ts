import { ValidationFailedError } from '../../../infra/errors/validation-failed.error';
import { Result } from '../../../infra/models/result';
import { UseCase } from '../../../infra/models/use-case';
import { UpdateConnectorContract } from '../contracts/update-connector.contract';
import { UpdateConnectorDto } from '../dtos/update-connector.dto';
import { Connector } from '../models/connector';
import { Privacy } from '../models/privacy';
import { Type } from '../models/type';
import { IConnectorRepository } from '../repositories/connector.repository.interface';

export class UpdateConnector implements UseCase<UpdateConnectorDto, Result<Connector>> {
  private connectorRepository: IConnectorRepository;

  constructor(connectorRepository: IConnectorRepository) {
    this.connectorRepository = connectorRepository;
  }

  async handle(dto: UpdateConnectorDto): Promise<Result<Connector>> {
    this.validate(dto);

    const foundConnector = await this.findConnector(dto.id);

    const connectorToUpdate = await this.getConnectorWithNewValues(foundConnector, dto);
    const connectorUpdated = await this.connectorRepository.update(connectorToUpdate);

    const result = new Result<Connector>(connectorUpdated, 'success on update connector');
    return result;
  }

  private getConnectorWithNewValues(oldConnector: Connector, dto: UpdateConnectorDto) {
    const connectorToUptade = { ...oldConnector };

    if (dto.name) {
      connectorToUptade.name = dto.name;
    }

    if (dto.baseURL) {
      connectorToUptade.baseURL = dto.baseURL;
    }

    if (dto.category) {
      connectorToUptade.category = dto.category;
    }

    if (dto.description) {
      connectorToUptade.description = dto.description;
    }

    if (dto.type) {
      connectorToUptade.type = dto.type as Type;
    }

    if (dto.privacy) {
      connectorToUptade.privacy = dto.privacy as Privacy;
    }

    if (dto.status !== undefined) {
      connectorToUptade.status = dto.status;
    }

    return connectorToUptade;
  }

  private validate(dto: UpdateConnectorDto) {
    const contract = new UpdateConnectorContract(dto);
    const isInvalid = !contract.validate();
    if (isInvalid) {
      throw new ValidationFailedError('fail to update connector', ...contract.reports);
    }
  }

  private async findConnector(id: string): Promise<Connector> {
    const foundConnector = await this.connectorRepository.findById(id);

    if (!foundConnector) {
      throw new ValidationFailedError('fail to update connector', {
        name: 'id',
        message: 'connector is not found'
      });
    }

    return foundConnector;
  }
}
