import { Report } from '../models/report';

export class UnauthorizedError extends Error {
  private _reports: Report[];

  constructor(message: string, ...reports: Report[]) {
    super(message);
    this._reports = reports;
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  public get reports(): Report[] {
    return this._reports;
  }
}
