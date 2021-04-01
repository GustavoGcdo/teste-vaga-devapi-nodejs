import supertest from 'supertest';
import { App } from '../../src/app';
import { HttpStatus } from '../../src/presentation/helper/enums/http-status.enum';

describe('info route', () => {
  const app = new App();

  beforeAll(async () => {
    await app.create();
  });

  afterAll(async () => {
    await app.disconnect();
  });

  it('should be return info api', async () => {
    const response = await supertest(app.getApplication()).get('/');

    expect(response.status).toBe(HttpStatus.SUCCESS);
    expect(response.body.message).toBe('success on get info API');
    expect(response.body.data).toStrictEqual({ name: 'test-devapi-nodejs', version: '1.0.0' });
  });
});
