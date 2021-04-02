import { stringify } from 'qs';
import supertest from 'supertest';
import { App } from '../../../src/app';
import { PaginateConnectorsDto } from '../../../src/modules/connectors/dtos/paginate-connectors.dto';
import { createValidConnector, deleteConnector } from '../../helpers/connector-functions';
import { deleteUser, getValidTokenAndUser } from '../../helpers/user-functions';

describe('paginate connectors route', () => {
  const app = new App();

  beforeAll(async () => {
    await app.create();
  });

  afterAll(async () => {
    await app.disconnect();
  });

  it('must page successfully when passing valid parameters', async () => {
    const { user, token } = await getValidTokenAndUser();
    const connectorCreated1 = await createValidConnector();
    const connectorCreated2 = await createValidConnector();
    const connectorCreated3 = await createValidConnector();

    const EXPECTED_LIMIT = 2;
    const EXPECTED_PAGE = 1;

    const validParams: PaginateConnectorsDto = {
      page: EXPECTED_PAGE + '',
      limit: EXPECTED_LIMIT + '',
      privacy: connectorCreated1.privacy,
      type: connectorCreated1.type
    };

    const queryString = stringify(validParams);

    const response = await supertest(app.getApplication())
      .get(`/connectors?${queryString}`)
      .set('Authorization', 'Bearer ' + token);

    expect(response.body.success).toBeTruthy();
    expect(response.body.data.currentPage).toBe(EXPECTED_PAGE);
    expect(response.body.data.limit).toBe(EXPECTED_LIMIT);
    expect(Array.isArray(response.body.data.results)).toBeTruthy();
    expect(response.body.data.results.length).toBe(EXPECTED_LIMIT);

    await deleteUser(user.id);
    await deleteConnector(connectorCreated1.id);
    await deleteConnector(connectorCreated2.id);
    await deleteConnector(connectorCreated3.id);
  });

  it('must fail when trying to page when passing valid parameters', async () => {
    const { user, token } = await getValidTokenAndUser();
    const connectorCreated1 = await createValidConnector();

    const invalidParams: PaginateConnectorsDto = {
      page: 'invalidPage',
      limit: 'invalidLimit',
      privacy: 'invalidPrivacy',
      type: 'invalidType'
    };

    const queryString = stringify(invalidParams);

    const response = await supertest(app.getApplication())
      .get(`/connectors?${queryString}`)
      .set('Authorization', 'Bearer ' + token);

    expect(response.body.success).toBeFalsy();
    expect(response.body.data).toBeNull();
    expect(response.body.errors).toContainEqual({
      name: 'page',
      message: 'page must be a valid number'
    });
    expect(response.body.errors).toContainEqual({
      name: 'limit',
      message: 'limit must be a valid number'
    });
    expect(response.body.errors).toContainEqual({
      name: 'privacy',
      message: 'unknow privacy, use: private, public instead'
    });
    expect(response.body.errors).toContainEqual({
      name: 'type',
      message: 'unknow type, use: rest, bd, soap instead'
    });

    await deleteUser(user.id);
    await deleteConnector(connectorCreated1.id);
  });
});
