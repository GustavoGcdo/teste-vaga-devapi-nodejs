import { Request, Response } from 'express';
import { Signup } from '../../modules/auth/use-cases/signup';
import { HttpStatus } from '../helper/enums/http-status.enum';
import { HandleResponse } from '../helper/handle-response';

export class AuthController {
  private signupUseCase: Signup;

  constructor(signup: Signup) {
    this.signupUseCase = signup;
  }

  async signup(request: Request, response: Response) {
    try {
      const result = await this.signupUseCase.handle(request.body);
      return HandleResponse.handle(response, HttpStatus.SUCCESS, result);
    } catch (error) {
      return HandleResponse.handleError(response, HttpStatus.BAD_REQUEST, error);
    }
  }
}
