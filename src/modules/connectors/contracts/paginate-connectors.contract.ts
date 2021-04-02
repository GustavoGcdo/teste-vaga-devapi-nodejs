import { Contract } from '../../../infra/models/contract';
import { Notifiable } from '../../../infra/models/notifiable';
import { Validator } from '../../../infra/validator/validator';
import { PaginateConnectorsDto } from '../dtos/paginate-connectors.dto';
import { Privacy } from '../models/privacy';
import { Type } from '../models/type';

export class PaginateConnectorsContract
  extends Notifiable
  implements Contract<PaginateConnectorsDto> {
  private dto: PaginateConnectorsDto;
  private validator: Validator;

  constructor(dto: PaginateConnectorsDto) {
    super();
    this.dto = dto;
    this.validator = new Validator();
  }

  validate(): boolean {
    this.validatePage();
    this.validateLimit();
    this.validateType();
    this.validatePrivacy();

    this.addReports(this.validator.reports);
    return this.isValid();
  }

  private validatePage() {
    const { page } = this.dto;

    if (page) {
      this.validator.isValidNumber(page, 'page', 'page must be a valid number');

      const MIN_PAGE = 1;
      this.validator.isLessThan(parseInt(page), MIN_PAGE, 'page', 'page must be greather than zero');
    }
  }

  private validateLimit() {
    const { limit } = this.dto;

    if (limit) {
      this.validator.isValidNumber(limit, 'limit', 'limit must be a valid number');

      const MAX_LIMIT = 100;
      this.validator.isGreaterThan(parseInt(limit), MAX_LIMIT, 'limit', `limit must be less than ${MAX_LIMIT}`);
    }
  }

  private validateType() {
    const { type } = this.dto;

    if (type) {
      const avaliableTypes = Object.values(Type);
      const isNotValidType = !avaliableTypes.some((v) => v === type);
      if (isNotValidType) {
        this.addReport({
          name: 'type',
          message: `unknow type, use: ${avaliableTypes.join(', ')} instead`
        });
      }
    }
  }

  private validatePrivacy() {
    const { privacy } = this.dto;

    if (privacy) {
      const avaliablePrivacies = Object.values(Privacy);
      const isNotValidPrivacy = !avaliablePrivacies.some((v) => v === privacy);
      if (isNotValidPrivacy) {
        this.addReport({
          name: 'privacy',
          message: `unknow privacy, use: ${avaliablePrivacies.join(', ')} instead`
        });
      }
    }
  }
}
