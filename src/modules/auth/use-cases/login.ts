import { ValidationFailedError } from '../../../infra/errors/validation-failed.error';
import { Result } from '../../../infra/models/result';
import { UseCase } from '../../../infra/models/use-case';
import { IEncriptService } from '../../shared/services/encript.service';
import { User } from '../../users/models/user';
import { IUserRepository } from '../../users/repositories/user.repository.interface';
import { LoginContract } from '../contracts/login.contract';
import { LoginDto } from '../dtos/login.dto';
import { IAuthService } from '../service/auth.service.interface';

type ResponseLogin = {
  token: string;
};

export class Login implements UseCase<LoginDto, Result<ResponseLogin>> {
  private userRepository: IUserRepository;
  private encriptService: IEncriptService;
  private authService: IAuthService;

  constructor(
    userRepository: IUserRepository,
    encriptService: IEncriptService,
    authService: IAuthService
  ) {
    this.userRepository = userRepository;
    this.encriptService = encriptService;
    this.authService = authService;
  }

  async handle(dto: LoginDto): Promise<Result<ResponseLogin>> {
    this.validate(dto);

    const { id, email } = await this.findIfUserExists(dto);
    const token = await this.authService.generateToken({ id, email });

    const returnValue: ResponseLogin = { token };

    const result = new Result<ResponseLogin>(returnValue, 'success on login user');
    return result;
  }

  private validate(dto: LoginDto) {
    const contract = new LoginContract(dto);
    const isInvalid = !contract.validate();
    if (isInvalid) {
      throw new ValidationFailedError('fail to register user', ...contract.reports);
    }
  }

  private async findIfUserExists(dto: LoginDto): Promise<User> {
    const { email, password } = dto;
    const encriptedPassword = await this.encriptService.encript(password);
    const userFound = await this.userRepository.findByEmailAndPassword(email, encriptedPassword);

    if (!userFound) {
      throw new ValidationFailedError('fail to login user', {
        name: 'login',
        message: 'user not found'
      });
    }

    return userFound;
  }
}
