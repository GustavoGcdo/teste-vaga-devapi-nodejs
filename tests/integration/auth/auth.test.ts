import supertest from 'supertest';
import { App } from '../../../src/app';
import { SignupDto } from '../../../src/modules/auth/dtos/signup.dto';
import { HttpStatus } from '../../../src/presentation/helper/enums/http-status.enum';
import { deleteUser } from '../../helpers/user-functions';

describe('auth route', () => {
  const app = new App();

  beforeAll(async () => {
    await app.create();
  });

  afterAll(async () => {
    await app.disconnect();
  });

  it('must return successful user creation with valid credentials', async () => {
    const validUser: SignupDto = {
      email: 'user@email.com',
      password: '123456'
    };

    const response = await supertest(app.getApplication()).post('/auth/signup').send(validUser);

    expect(response.status).toBe(HttpStatus.SUCCESS);
    expect(response.body.message).toBe('success on register user');
    expect(response.body.data).toHaveProperty('token');

    const { user } = response.body.data;
    await deleteUser(user.id);
  });

  it('should return failure when trying to create a user with invalid credentials', async () => {
    const invalidUser: SignupDto = {
      email: 'user',
      password: '12345'
    };

    const response = await supertest(app.getApplication()).post('/auth/signup').send(invalidUser);

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

  it('should return failure when trying to create existing user', async () => {
    const invalidUser: SignupDto = {
      email: 'user@email.com',
      password: '123456'
    };

    const firstResponse = await supertest(app.getApplication())
      .post('/auth/signup')
      .send(invalidUser);
    expect(firstResponse.status).toBe(HttpStatus.SUCCESS);
    expect(firstResponse.body.success).toBeTruthy();

    const secondResponse = await supertest(app.getApplication())
      .post('/auth/signup')
      .send(invalidUser);
    expect(secondResponse.status).toBe(HttpStatus.BAD_REQUEST);
    expect(secondResponse.body.success).toBeFalsy();

    expect(secondResponse.body.errors).toContainEqual({
      name: 'email',
      message: 'email already registered'
    });

    const { user } = firstResponse.body.data;
    await deleteUser(user.id);
  });
});
