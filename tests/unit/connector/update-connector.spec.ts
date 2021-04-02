import { mock } from 'jest-mock-extended';
import { ValidationFailedError } from '../../../src/infra/errors/validation-failed.error';
import { UpdateConnectorDto } from '../../../src/modules/connectors/dtos/update-connector.dto';
import { Connector } from '../../../src/modules/connectors/models/connector';
import { IConnectorRepository } from '../../../src/modules/connectors/repositories/connector.repository.interface';
import { UpdateConnector } from '../../../src/modules/connectors/use-cases/update-connector';

describe('update an connector', () => {
  const mockConnectorRepo = mock<IConnectorRepository>();

  it('must update a connector successfully when passing valid values', async () => {
    const updateConnector = new UpdateConnector(mockConnectorRepo);

    const validConnector: UpdateConnectorDto = {
      id: 'mockId',
      name: 'Google drive',
      baseURL: 'https://drive.google.com/',
      category: 'Armazenamento',
      description: 'Armazenamento de midias',
      privacy: 'private',
      status: true,
      type: 'rest'
    };

    mockConnectorRepo.findById.mockResolvedValueOnce(validConnector as Connector);

    const result = await updateConnector.handle(validConnector);
    expect(result.success).toBeTruthy();
    expect(result.message).toBe('success on update connector');
  });

  it('must fail when trying to update a connector with invalid values', async () => {
    const updateConnector = new UpdateConnector(mockConnectorRepo);

    const invalidConnector: UpdateConnectorDto = {
      id: '',
      name: '   ',
      baseURL: '  ',
      category: 'Armazenamento',
      description: 'Armazenamento de midias',
      privacy: 'invalidPrivacy',
      status: true,
      type: 'invalidType'
    };

    expect.assertions(6);
    try {
      await updateConnector.handle(invalidConnector);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationFailedError);
      expect(error.reports).toContainEqual({
        name: 'id',
        message: 'id is required'
      });
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
