import { mock } from 'jest-mock-extended';
import { ValidationFailedError } from '../../../src/infra/errors/validation-failed.error';
import { PaginateConnectorsDto } from '../../../src/modules/connectors/dtos/paginate-connectors.dto';
import { IConnectorRepository } from '../../../src/modules/connectors/repositories/connector.repository.interface';
import { PaginateConnectors } from '../../../src/modules/connectors/use-cases/paginate-connectors';

describe('paginate connectors', () => {
  const mockConnectorRepo = mock<IConnectorRepository>();

  it('should be paginate connectors with valid search params', async () => {
    const paginateConnectors = new PaginateConnectors(mockConnectorRepo);
    const validParams: PaginateConnectorsDto = {
      page: '1',
      limit: '2',
      category: 'api',
      privacy: 'public',
      type: 'rest'
    };

    mockConnectorRepo.find.mockResolvedValueOnce({ results: [], total: 0 });

    const result = await paginateConnectors.handle(validParams);
    expect(result.success).toBeTruthy();
    expect(result.data).toHaveProperty('currentPage');
    expect(result.data).toHaveProperty('limit');
    expect(result.data).toHaveProperty('results');
    expect(Array.isArray(result.data.results)).toBeTruthy();
    expect(result.data).toHaveProperty('total');
  });

  it('should be fail when try paginate connectors with invalid search params', async () => {
    const paginateConnectors = new PaginateConnectors(mockConnectorRepo);
    const invalidParams: PaginateConnectorsDto = {
      page: 'invalidPage',
      limit: 'invalidLimit',
      privacy: 'invalidPrivacy',
      type: 'invalidyType'
    };

    expect.assertions(5);
    try {
      await paginateConnectors.handle(invalidParams);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationFailedError);
      expect(error.reports).toContainEqual({
        name: 'page', message: 'page must be a valid number'
      });
      expect(error.reports).toContainEqual({
        name: 'limit', message: 'limit must be a valid number'
      });
      expect(error.reports).toContainEqual({
        name: 'privacy', message: 'unknow privacy, use: private, public instead'
      });
      expect(error.reports).toContainEqual({
        name: 'type', message: 'unknow type, use: rest, bd, soap instead'
      });
    }
  });
});
