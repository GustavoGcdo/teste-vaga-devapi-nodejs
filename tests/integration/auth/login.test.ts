import supertest from 'supertest';
import { App } from '../../../src/app';
import { LoginDto } from '../../../src/modules/auth/dtos/login.dto';
import { HttpStatus } from '../../../src/presentation/helper/enums/http-status.enum';
import { deleteUser, getRamdomValidEmail } from '../../helpers/user-functions';

describe('Login route', () => {
  const app = new App();

  beforeAll(async () => {
    await app.create();
  });

  afterAll(async () => {
    await app.disconnect();
  });

  it('must return successful user login with valid credentials', async () => {
    const validUser: LoginDto = {
      email: getRamdomValidEmail(),
      password: '123456'
    };

    const firstResponse = await supertest(app.getApplication())
      .post('/auth/signup')
      .send(validUser);

    expect(firstResponse.body.success).toBeTruthy();

    const response = await supertest(app.getApplication()).post('/auth/login').send(validUser);

    expect(response.status).toBe(HttpStatus.SUCCESS);
    expect(response.body.message).toBe('success on login user');
    expect(response.body.data).toHaveProperty('token');

    const { user } = firstResponse.body.data;
    await deleteUser(user.id);
  });

  it('should return failure when trying to login a user with invalid credentials', async () => {
    const invalidUser: LoginDto = {
      email: 'user',
      password: '12345'
    };

    const response = await supertest(app.getApplication()).post('/auth/login').send(invalidUser);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe('fail to register user');
    expect(response.body.data).toBeNull();
    expect(response.body.errors).toContainEqual({
      name: 'email',
      message: 'invalid email'
    });

    expect(response.body.errors).toContainEqual({
      name: 'password',
      message: 'password must be minimum 6 characters'
    });
  });

  it('should return failure when trying to login an unexisting user', async () => {
    const validUser: LoginDto = {
      email: getRamdomValidEmail(),
      password: '123456'
    };

    const response = await supertest(app.getApplication()).post('/auth/login').send(validUser);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.success).toBeFalsy();

    expect(response.body.errors).toContainEqual({
      name: 'login',
      message: 'user not found'
    });
  });
});
