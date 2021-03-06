import { Response } from 'express';
import { UnauthorizedError } from '../../infra/errors/unauthorized.error';
import { ValidationFailedError } from '../../infra/errors/validation-failed.error';
import { Result } from '../../infra/models/result';
import { HttpStatus } from './enums/http-status.enum';

export abstract class HandleResponse {
  public static handle(response: Response, status: HttpStatus, result: Result<unknown>) {
    return response.status(status).send(result);
  }

  public static handleError(response: Response, status: HttpStatus, error: Error) {
    if (error instanceof ValidationFailedError) {
      return response.status(status).send(new Result(null, error.message, false, error.reports));
    }

    if (error instanceof UnauthorizedError) {
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .send(new Result(null, error.message, false, error.reports));
    }
    return response
      .status(HttpStatus.INTERNAL_ERROR)
      .send(
        new Result(null, error.message, false, [
          { name: 'server', message: 'internal server error' }
        ])
      );
  }
}
