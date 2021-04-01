import { mock } from 'jest-mock-extended';
import { ValidationFailedError } from '../../../src/infra/errors/validation-failed.error';
import { SignupDto } from '../../../src/modules/auth/dtos/signup.dto';
import { IAuthService } from '../../../src/modules/auth/service/auth.service.interface';
import { Signup } from '../../../src/modules/auth/use-cases/signup';
import { IEncriptService } from '../../../src/modules/shared/services/encript.service';
import { User } from '../../../src/modules/users/models/user';
import { IUserRepository } from '../../../src/modules/users/repositories/user.repository.interface';

describe('Signup', () => {
  const mockUserRepository = mock<IUserRepository>();
  const mockAuthService = mock<IAuthService>();
  const mockEncriptService = mock<IEncriptService>();

  it('shoud be register user with valid credentials', async () => {
    const signup = new Signup(mockUserRepository, mockEncriptService, mockAuthService);

    const validUser: SignupDto = {
      email: 'user@email.com',
      password: '123456'
    };

    mockUserRepository.create.mockResolvedValueOnce({
      id: 'mockid',
      email: validUser.email
    } as User);
    mockAuthService.generateToken.mockResolvedValueOnce('mocktoken');

    const result = await signup.handle(validUser);
    expect(result.success).toBeTruthy();
    expect(result.data.token).toBeDefined();
  });

  it('should return failure when trying to create a user with invalid credentials', async () => {
    const signup = new Signup(mockUserRepository, mockEncriptService, mockAuthService);

    const invalidUser: SignupDto = {
      email: 'user',
      password: '12345'
    };

    expect.assertions(3);
    try {
      await signup.handle(invalidUser);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationFailedError);
      expect(error.reports).toContainEqual({
        name: 'email',
        message: 'invalid email'
      });
      expect(error.reports).toContainEqual({
        name: 'password',
        message: 'password must be minimum 6 characters'
      });
    }
  });

  it('should return failure when trying to create existing user', async () => {
    const signup = new Signup(mockUserRepository, mockEncriptService, mockAuthService);

    const validUser: SignupDto = {
      email: 'user@email.com',
      password: '123456'
    };

    expect.assertions(3);

    mockUserRepository.create.mockResolvedValueOnce({
      id: 'mockid',
      email: validUser.email
    } as User);

    const firstResult = await signup.handle(validUser);
    expect(firstResult.success).toBeTruthy();

    try {
      mockUserRepository.findByEmail.mockResolvedValueOnce({
        id: 'mockid',
        email: validUser.email
      } as User);

      await signup.handle(validUser);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationFailedError);
      expect(error.reports).toContainEqual({
        name: 'email',
        message: 'email already registered'
      });
    }
  });
});
