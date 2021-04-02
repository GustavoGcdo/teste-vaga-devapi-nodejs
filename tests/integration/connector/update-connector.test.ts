import supertest from 'supertest';
import { App } from '../../../src/app';
import { UpdateConnectorDto } from '../../../src/modules/connectors/dtos/update-connector.dto';
import { HttpStatus } from '../../../src/presentation/helper/enums/http-status.enum';
import { createValidConnector, deleteConnector } from '../../helpers/connector-functions';
import { deleteUser, getValidTokenAndUser } from '../../helpers/user-functions';

describe('update connector route', () => {
  const app = new App();

  beforeAll(async () => {
    await app.create();
  });

  afterAll(async () => {
    await app.disconnect();
  });

  it('must update a connector successfully when passing valid values', async () => {
    const { user, token } = await getValidTokenAndUser();
    const connector = await createValidConnector();

    const validConnector = {
      name: 'Google drive - updated',
      baseURL: 'https://drive.google.com/',
      category: 'Armazenamento - updated',
      description: 'Armazenamento de midias',
      privacy: 'private',
      status: true,
      type: 'rest'
    } as UpdateConnectorDto;

    const response = await supertest(app.getApplication())
      .put(`/connectors/${connector.id}`)
      .send(validConnector)
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toBe(HttpStatus.SUCCESS);
    expect(response.body.success).toBeTruthy();
    expect(response.body.message).toBe('success on update connector');
    expect(response.body.data.name).toBe(validConnector.name);
    expect(response.body.data.category).toBe(validConnector.category);

    await deleteUser(user.id);
    await deleteConnector(connector.id);
  });

  it('must fail when trying to update a connector when passing invalid values', async () => {
    const { user, token } = await getValidTokenAndUser();
    const connector = await createValidConnector();

    const invalidConnector = {
      privacy: 'invalidPrivacy',
      type: 'invalidType'
    } as UpdateConnectorDto;

    const response = await supertest(app.getApplication())
      .put(`/connectors/${connector.id}`)
      .send(invalidConnector)
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.success).toBeFalsy();
    expect(response.body.message).toBe('fail to update connector');
    expect(response.body.data).toBeNull();

    await deleteUser(user.id);
    await deleteConnector(connector.id);
  });
});
