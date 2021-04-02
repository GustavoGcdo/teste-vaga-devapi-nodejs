import { mock } from 'jest-mock-extended';
import { ValidationFailedError } from '../../../src/infra/errors/validation-failed.error';
import { CreateConnectorDto } from '../../../src/modules/connectors/dtos/create-connector.dto';
import { IConnectorRepository } from '../../../src/modules/connectors/repositories/connector.repository.interface';
import { CreateConnector } from '../../../src/modules/connectors/use-cases/create-connector';

describe('create an connector', () => {
  const mockConnectorRepo = mock<IConnectorRepository>();
  it('should be create with success a connector with valid values', async () => {
    const createConnector = new CreateConnector(mockConnectorRepo);

    const validConnector: CreateConnectorDto = {
      name: 'Google drive',
      baseURL: 'https://drive.google.com/',
      category: 'Armazenamento',
      description: 'Armazenamento de midias',
      privacy: 'private',
      status: true,
      type: 'rest'
    };

    const result = await createConnector.handle(validConnector);
    expect(result.success).toBeTruthy();
    expect(result.message).toBe('success on create connector');
  });

  it('should be fail on try create a connector with invalid values', async () => {
    const createConnector = new CreateConnector(mockConnectorRepo);

    const invalidConnector: CreateConnectorDto = {
      name: '',
      baseURL: '',
      category: 'Armazenamento',
      description: 'Armazenamento de midias',
      privacy: 'invalidPrivacy',
      status: true,
      type: 'invalidType'
    };

    expect.assertions(5);
    try {
      await createConnector.handle(invalidConnector);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationFailedError);
      expect(error.reports).toContainEqual({
        name: 'name',
        message: 'name is required'
      });
      expect(error.reports).toContainEqual({
        name: 'baseURL',
        message: 'baseURL is required'
      });
      expect(error.reports).toContainEqual({
        name: 'type',
        message: 'type invalid, use: rest, bd, soap'
      });
      expect(error.reports).toContainEqual({
        name: 'privacy',
        message: 'privacy invalid, use: private, public'
      });
    }
  });
});
