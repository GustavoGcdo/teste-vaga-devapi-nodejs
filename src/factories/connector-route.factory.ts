import { AuthService } from '../modules/auth/service/auth.service';
import { MongoDBConnectorRepository } from '../modules/connectors/repositories/mongodb-connector.repository';
import { CreateConnector } from '../modules/connectors/use-cases/create-connector';
import { PaginateConnectors } from '../modules/connectors/use-cases/paginate-connectors';
import { ConnectorController } from '../presentation/controllers/connector.controller';
import { AuthMiddleware } from '../presentation/middlewares/auth.middleware';
import { ConnectorRoutes } from '../presentation/routes/connector.routes';
import { UpdateConnector } from '../modules/connectors/use-cases/update-connector';
import { RemoveConnector } from '../modules/connectors/use-cases/remove-connector';

export const makeConnectorRoutes = (): ConnectorRoutes => {
  const connectorRepository = new MongoDBConnectorRepository();
  const authService = new AuthService();
  const authMiddleware = new AuthMiddleware(authService);
  const paginateConnectors = new PaginateConnectors(connectorRepository);
  const createConnector = new CreateConnector(connectorRepository);
  const updateConnector = new UpdateConnector(connectorRepository);
  const removeConnector = new RemoveConnector(connectorRepository);

  const controller = new ConnectorController(
    paginateConnectors,
    createConnector,
    updateConnector,
    removeConnector
  );
  const route = new ConnectorRoutes(controller, authMiddleware);
  return route;
};
