import { Contract } from '../../../infra/models/contract';
import { Notifiable } from '../../../infra/models/notifiable';
import { Validator } from '../../../infra/validator/validator';
import { RemoveConnectorDto } from '../dtos/remove-connectors.dto';

export class RemoveConnectorContract extends Notifiable implements Contract<RemoveConnectorDto> {
  private dto: RemoveConnectorDto;
  private validator: Validator;

  constructor(dto: RemoveConnectorDto) {
    super();
    this.dto = dto;
    this.validator = new Validator();
  }

  validate(): boolean {
    this.validateId();

    this.addReports(this.validator.reports);
    return this.isValid();
  }

  private validateId() {
    const { id } = this.dto;

    this.validator.isRequired(id, 'id', 'id is required');
  }
}
