import supertest from 'supertest';
import { App } from '../../../src/app';
import { CreateConnectorDto } from '../../../src/modules/connectors/dtos/create-connector.dto';
import { HttpStatus } from '../../../src/presentation/helper/enums/http-status.enum';
import { deleteConnector } from '../../helpers/connector-functions';
import { deleteUser, getValidTokenAndUser } from '../../helpers/user-functions';

describe('create connector route', () => {
  const app = new App();

  beforeAll(async () => {
    await app.create();
  });

  afterAll(async () => {
    await app.disconnect();
  });

  it('should be create with success a connector with valid values', async () => {
    const { user, token } = await getValidTokenAndUser();
    const validConnector: CreateConnectorDto = {
      name: 'Google drive',
      baseURL: 'https://drive.google.com/',
      category: 'Armazenamento',
      description: 'Armazenamento de midias',
      privacy: 'private',
      status: true,
      type: 'rest'
    };

    const response = await supertest(app.getApplication())
      .post('/connectors')
      .send(validConnector)
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body.success).toBeTruthy();
    expect(response.body.message).toBe('success on create connector');

    await deleteConnector(response.body.data.id);
    await deleteUser(user.id);
  });

  it('should be fail on try create a connector with invalid values', async () => {
    const { user, token } = await getValidTokenAndUser();

    const invalidConnector: CreateConnectorDto = {
      name: '',
      baseURL: '',
      category: 'Armazenamento',
      description: 'Armazenamento de midias',
      privacy: 'invalidPrivacy',
      status: true,
      type: 'invalidType'
    };

    const response = await supertest(app.getApplication())
      .post('/connectors')
      .send(invalidConnector)
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toBe('fail to create connector');
    expect(response.body.errors).toContainEqual({
      name: 'name',
      message: 'name is required'
    });
    expect(response.body.errors).toContainEqual({
      name: 'baseURL',
      message: 'baseURL is required'
    });
    expect(response.body.errors).toContainEqual({
      name: 'type',
      message: 'type invalid, use: rest, bd, soap'
    });
    expect(response.body.errors).toContainEqual({
      name: 'privacy',
      message: 'privacy invalid, use: private, public'
    });

    await deleteUser(user.id);
  });
});
