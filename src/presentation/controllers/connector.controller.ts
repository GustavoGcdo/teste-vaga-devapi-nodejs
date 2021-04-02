import { Request, Response } from 'express';
import { CreateConnector } from '../../modules/connectors/use-cases/create-connector';
import { HttpStatus } from '../helper/enums/http-status.enum';
import { HandleResponse } from '../helper/handle-response';

export class ConnectorController {
  private createConnectorUseCase: CreateConnector;

  constructor(createConnectorUseCase: CreateConnector) {
    this.createConnectorUseCase = createConnectorUseCase;
  }

  async create(request: Request, response: Response) {
    try {
      const result = await this.createConnectorUseCase.handle(request.body);
      return HandleResponse.handle(response, HttpStatus.CREATED, result);
    } catch (error) {
      return HandleResponse.handleError(response, HttpStatus.BAD_REQUEST, error);
    }
  }
}
