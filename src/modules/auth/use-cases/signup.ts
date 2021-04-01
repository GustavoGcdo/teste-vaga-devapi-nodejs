import { ValidationFailedError } from '../../../infra/errors/validation-failed.error';
import { Result } from '../../../infra/models/result';
import { UseCase } from '../../../infra/models/use-case';
import { IEncriptService } from '../../shared/services/encript.service';
import { User } from '../../users/models/user';
import { IUserRepository } from '../../users/repositories/user.repository.interface';
import { SigupContract } from '../contracts/signup.contract';
import { SignupDto } from '../dtos/signup.dto';
import { Payload } from '../models/payload';
import { IAuthService } from '../service/auth.service.interface';

type ResponseSignup = {
  user: {
    email: string;
    id: string;
  };
  token: string;
};

export class Signup implements UseCase<SignupDto, Result<ResponseSignup>> {
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

  async handle(dto: SignupDto): Promise<Result<ResponseSignup>> {
    this.validate(dto);

    const userExists = await this.verifyIfEmailAlreadyExists(dto.email);

    if (userExists) {
      throw new ValidationFailedError('fail to register user', {
        name: 'email',
        message: 'email already registered'
      });
    }

    const { id, email } = await this.createUser(dto);

    const token = await this.generateToken({ id, email });

    const returnValue: ResponseSignup = {
      user: { id, email },
      token
    };

    const result = new Result<ResponseSignup>(returnValue, 'success on register user');

    return result;
  }

  private validate(dto: SignupDto) {
    const contract = new SigupContract(dto);
    const isInvalid = !contract.validate();
    if (isInvalid) {
      throw new ValidationFailedError('fail to register user', ...contract.reports);
    }
  }

  private async verifyIfEmailAlreadyExists(email: string): Promise<boolean> {
    const userFound = await this.userRepository.findByEmail(email);
    return !!userFound;
  }

  private async createUser(dto: SignupDto) {
    const encriptedPassword = await this.encriptService.encript(dto.password);
    const userToCreate = {
      email: dto.email.toLowerCase(),
      password: encriptedPassword
    } as User;

    const userCreated = await this.userRepository.create(userToCreate);
    return userCreated;
  }

  private async generateToken(payload: Payload) {
    return await this.authService.generateToken({
      email: payload.email,
      id: payload.id
    });
  }
}
