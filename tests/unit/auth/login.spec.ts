import { mock } from 'jest-mock-extended';
import { ValidationFailedError } from '../../../src/infra/errors/validation-failed.error';
import { LoginDto } from '../../../src/modules/auth/dtos/login.dto';
import { IAuthService } from '../../../src/modules/auth/service/auth.service.interface';
import { Login } from '../../../src/modules/auth/use-cases/login';
import { IEncriptService } from '../../../src/modules/shared/services/encript.service';
import { User } from '../../../src/modules/users/models/user';
import { IUserRepository } from '../../../src/modules/users/repositories/user.repository.interface';

describe('Login', () => {
  const mockUserRepository = mock<IUserRepository>();
  const mockAuthService = mock<IAuthService>();
  const mockEncriptService = mock<IEncriptService>();

  it('shoud be login user with valid credentials', async () => {
    const login = new Login(mockUserRepository, mockEncriptService, mockAuthService);

    const validUser: LoginDto = {
      email: 'user@email.com',
      password: '123456'
    };

    mockUserRepository.findByEmailAndPassword.mockResolvedValueOnce({
      id: 'mockid',
      email: validUser.email
    } as User);

    mockAuthService.generateToken.mockResolvedValueOnce('mocktoken');

    const result = await login.handle(validUser);
    expect(result.success).toBeTruthy();
    expect(result.data.token).toBeDefined();
  });

  it('should failure when trying to login with invalid credentials', async () => {
    const login = new Login(mockUserRepository, mockEncriptService, mockAuthService);

    const invalidUser: LoginDto = {
      email: 'user',
      password: '12345'
    };

    expect.assertions(3);
    try {
      await login.handle(invalidUser);
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

  it('must fail when trying to login with the nonexistent user', async () => {
    const login = new Login(mockUserRepository, mockEncriptService, mockAuthService);

    const validUser: LoginDto = {
      email: 'user@email.com',
      password: '123456'
    };

    expect.assertions(2);
    try {
      await login.handle(validUser);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationFailedError);
      expect(error.reports).toContainEqual({
        name: 'login',
        message: 'user not found'
      });
    }
  });
});
