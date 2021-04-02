import { Request, Response } from 'express';
import { CreateConnectorDto } from '../../modules/connectors/dtos/create-connector.dto';
import { PaginateConnectorsDto } from '../../modules/connectors/dtos/paginate-connectors.dto';
import { CreateConnector } from '../../modules/connectors/use-cases/create-connector';
import { PaginateConnectors } from '../../modules/connectors/use-cases/paginate-connectors';
import { HttpStatus } from '../helper/enums/http-status.enum';
import { HandleResponse } from '../helper/handle-response';

export class ConnectorController {
  private paginateConnectorsUseCase: PaginateConnectors;
  private createConnectorUseCase: CreateConnector;

  constructor(
    paginateConnectorsUseCase: PaginateConnectors,
    createConnectorUseCase: CreateConnector
  ) {
    this.paginateConnectorsUseCase = paginateConnectorsUseCase;
    this.createConnectorUseCase = createConnectorUseCase;
  }

  async paginate(request: Request, response: Response) {
    try {
      const params = request.query as PaginateConnectorsDto;
      const result = await this.paginateConnectorsUseCase.handle(params);
      return HandleResponse.handle(response, HttpStatus.CREATED, result);
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
}
