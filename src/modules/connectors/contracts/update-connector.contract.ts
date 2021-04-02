import { Contract } from '../../../infra/models/contract';
import { Notifiable } from '../../../infra/models/notifiable';
import { Validator } from '../../../infra/validator/validator';
import { UpdateConnectorDto } from '../dtos/update-connector.dto';
import { Privacy } from '../models/privacy';
import { Type } from '../models/type';

export class UpdateConnectorContract extends Notifiable implements Contract<UpdateConnectorDto> {
  private dto: UpdateConnectorDto;
  private validator: Validator;

  constructor(dto: UpdateConnectorDto) {
    super();
    this.dto = dto;
    this.validator = new Validator();
  }

  validate(): boolean {
    this.validateId();
    this.validateName();
    this.validateBaseURL();
    this.validateType();
    this.validatePrivacy();

    this.addReports(this.validator.reports);
    return this.isValid();
  }

  private validateId() {
    const { id } = this.dto;
    this.validator.isRequired(id, 'id', 'id is required');
  }

  private validateName() {
    const { name } = this.dto;

    if (name && name.trim().length === 0) {
      this.addReport({ name: 'name', message: 'name is required' });
    }
  }

  private validateBaseURL() {
    const { baseURL } = this.dto;

    if (baseURL && baseURL.trim().length === 0) {
      this.addReport({ name: 'baseURL', message: 'baseURL is required' });
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
          message: `type invalid, use: ${avaliableTypes.join(', ')}`
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
          message: `privacy invalid, use: ${avaliablePrivacies.join(', ')}`
        });
      }
    }
  }
}
