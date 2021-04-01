import { Request, Response } from 'express';
import { Result } from '../../infra/models/result';
import { InfoService } from '../../modules/info/services/info.service';
import { HttpStatus } from '../helper/enums/http-status.enum';
import { HandleResponse } from '../helper/handle-response';
export class InfoController {
  private infoService: InfoService;

  constructor(infoService: InfoService) {
    this.infoService = infoService;
  }

  async getInfo(request: Request, response: Response) {
    try {
      const info = this.infoService.getInfo();
      const result = new Result(info, 'success on get info API');
      return HandleResponse.handle(response, HttpStatus.SUCCESS, result);
    } catch (error) {
      return HandleResponse.handleError(response, HttpStatus.BAD_REQUEST, error);
    }
  }
}
