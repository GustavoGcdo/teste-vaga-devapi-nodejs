import mongoose from 'mongoose';
import { CreateConnectorDto } from '../../src/modules/connectors/dtos/create-connector.dto';
import { MongoDBConnectorRepository } from '../../src/modules/connectors/repositories/mongodb-connector.repository';
import { CreateConnector } from '../../src/modules/connectors/use-cases/create-connector';

export async function deleteConnector(id: string) {
  const objcID = mongoose.Types.ObjectId(id);
  await mongoose.connection.collection('connectors').findOneAndDelete({ _id: objcID });
}

export async function createValidConnector() {
  const validConnector: CreateConnectorDto = {
    name: 'Google drive',
    baseURL: 'https://drive.google.com/',
    category: 'Armazenamento',
    description: 'Armazenamento de midias',
    privacy: 'private',
    status: true,
    type: 'rest'
  };

  const createConnector = new CreateConnector(new MongoDBConnectorRepository());

  const result = await createConnector.handle(validConnector);
  return result.data;
}
