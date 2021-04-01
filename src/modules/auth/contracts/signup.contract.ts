import { Contract } from '../../../infra/models/contract';
import { Notifiable } from '../../../infra/models/notifiable';
import { Validator } from '../../../infra/validator/validator';
import { SignupDto } from '../dtos/signup.dto';

export class SigupContract extends Notifiable implements Contract<SignupDto> {
  private dto: SignupDto;
  private validator: Validator;

  constructor(dto: SignupDto) {
    super();
    this.dto = dto;
    this.validator = new Validator();
  }

  validate(): boolean {
    this.validateEmail();
    this.validatePassword();

    this.addReports(this.validator.reports);
    return this.isValid();
  }

  private validateEmail() {
    const { email } = this.dto;
    this.validator.isRequired(email, 'email', 'email is required');
    this.validator.isValidEmail(email, 'email', 'invalid email');
  }

  private validatePassword() {
    const { password } = this.dto;
    this.validator.isRequired(password, 'password', 'password is required');

    if (password) {
      const MIN_LENGHT_PASSWORD = 6;
      this.validator.isLessThan(
        password.length,
        MIN_LENGHT_PASSWORD,
        'password',
        `password must be minimum ${MIN_LENGHT_PASSWORD} characters`
      );
    }
  }
}
