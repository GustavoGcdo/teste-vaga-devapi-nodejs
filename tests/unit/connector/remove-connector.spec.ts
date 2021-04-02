import { mock } from 'jest-mock-extended';
import { ValidationFailedError } from '../../../src/infra/errors/validation-failed.error';
import { IConnectorRepository } from '../../../src/modules/connectors/repositories/connector.repository.interface';
import { RemoveConnector } from '../../../src/modules/connectors/use-cases/remove-connector';
import { RemoveConnectorDto } from '../../../src/modules/connectors/dtos/remove-connectors.dto';
import { Connector } from '../../../src/modules/connectors/models/connector';

describe('remove connector', () => {
  const mockConnectorRepo = mock<IConnectorRepository>();

  it('must successfully remove a connector by passing valid id', async () => {
    const removeConnector = new RemoveConnector(mockConnectorRepo);

    const validParams: RemoveConnectorDto = { id: 'mockId' };

    mockConnectorRepo.findById.mockResolvedValueOnce({ status: true } as Connector);

    const result = await removeConnector.handle(validParams);

    expect(result.success).toBeTruthy();
    expect(result.message).toBe('success on remove connector');
    expect(result.data).toBeNull();
  });

  it('must fail when trying to remove a connector by passing not passing id', async () => {
    const removeConnector = new RemoveConnector(mockConnectorRepo);

    const invalidParams = {} as RemoveConnectorDto;

    expect.assertions(2);
    try {
      await removeConnector.handle(invalidParams);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationFailedError);
      expect(error.reports).toContainEqual({
        name: 'id',
        message: 'id is required'
      });
    }
  });

  it('must fail when trying to remove a connector by passing invalid id', async () => {
    const removeConnector = new RemoveConnector(mockConnectorRepo);

    const invalidParams = { id: 'invalidID' } as RemoveConnectorDto;
    mockConnectorRepo.findById.mockResolvedValueOnce(null);

    expect.assertions(2);
    try {
      await removeConnector.handle(invalidParams);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationFailedError);
      expect(error.reports).toContainEqual({
        name: 'id',
        message: 'connector is not found'
      });
    }
  });
});
