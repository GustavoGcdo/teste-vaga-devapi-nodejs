import { Request, Response } from 'express';
import { CreateConnectorDto } from '../../modules/connectors/dtos/create-connector.dto';
import { PaginateConnectorsDto } from '../../modules/connectors/dtos/paginate-connectors.dto';
import { CreateConnector } from '../../modules/connectors/use-cases/create-connector';
import { PaginateConnectors } from '../../modules/connectors/use-cases/paginate-connectors';
import { HttpStatus } from '../helper/enums/http-status.enum';
import { HandleResponse } from '../helper/handle-response';
import { UpdateConnector } from '../../modules/connectors/use-cases/update-connector';
import { UpdateConnectorDto } from '../../modules/connectors/dtos/update-connector.dto';

export class ConnectorController {
  private paginateConnectorsUseCase: PaginateConnectors;
  private createConnectorUseCase: CreateConnector;
  private updateConnectorUserCase: UpdateConnector;

  constructor(
    paginateConnectorsUseCase: PaginateConnectors,
    createConnectorUseCase: CreateConnector,
    updateConnectorUserCase: UpdateConnector
  ) {
    this.paginateConnectorsUseCase = paginateConnectorsUseCase;
    this.createConnectorUseCase = createConnectorUseCase;
    this.updateConnectorUserCase = updateConnectorUserCase;
  }

  async paginate(request: Request, response: Response) {
    try {
      const params = request.query as PaginateConnectorsDto;
      const result = await this.paginateConnectorsUseCase.handle(params);
      return HandleResponse.handle(response, HttpStatus.SUCCESS, result);
    } catch (error) {
      return HandleResponse.handleError(response, HttpStatus.BAD_REQUEST, error);
    }
  }

  async create(request: Request, response: Response) {
    try {
      const createDto = request.body as CreateConnectorDto;
      const result = await this.createConnectorUseCase.handle(createDto);
      return HandleResponse.handle(response, HttpStatus.CREATED, result);
    } catch (error) {
      return HandleResponse.handleError(response, HttpStatus.BAD_REQUEST, error);
    }
  }

  async update(request: Request, response: Response) {
    try {
      const id = request.params.id;
      const updateDto = { ...request.body, id } as UpdateConnectorDto;
      const result = await this.updateConnectorUserCase.handle(updateDto);
      return HandleResponse.handle(response, HttpStatus.SUCCESS, result);
    } catch (error) {
      return HandleResponse.handleError(response, HttpStatus.BAD_REQUEST, error);
    }
  }
}
