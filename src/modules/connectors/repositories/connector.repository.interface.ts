import { Connector } from '../models/connector';

export interface IConnectorRepository {
    create(connector: Connector): Promise<Connector>;
}
