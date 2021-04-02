import supertest from 'supertest';
import { App } from '../../../src/app';
import { createValidConnector, deleteConnector } from '../../helpers/connector-functions';
import { deleteUser, getValidTokenAndUser } from '../../helpers/user-functions';
import { HttpStatus } from '../../../src/presentation/helper/enums/http-status.enum';

describe('remove connector route', () => {
  const app = new App();

  beforeAll(async () => {
    await app.create();
  });

  afterAll(async () => {
    await app.disconnect();
  });

  it('must successfully remove a connector by passing valid id', async () => {
    const { user, token } = await getValidTokenAndUser();
    const connectorCreated = await createValidConnector();

    const response = await supertest(app.getApplication())
      .delete(`/connectors/${connectorCreated.id}`)
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toBe(HttpStatus.SUCCESS);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data).toBeNull();
    expect(response.body.message).toBe('success on remove connector');

    await deleteUser(user.id);
    await deleteConnector(connectorCreated.id);
  });

  it('must fail when trying to remove a connector by passing invalid id', async () => {
    const { user, token } = await getValidTokenAndUser();

    const invalidID = 'invalidID';
    const response = await supertest(app.getApplication())
      .delete(`/connectors/${invalidID}`)
      .set('Authorization', 'Bearer ' + token);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.success).toBeFalsy();
    expect(response.body.data).toBeNull();
    expect(response.body.message).toBe('fail to remove connector');
    expect(response.body.errors).toContainEqual({
      name: 'id',
      message: 'connector is not found'
    });

    await deleteUser(user.id);
  });
});
