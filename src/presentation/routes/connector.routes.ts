import { Router } from 'express';
import { Route } from '../../infra/models/route';
import { ConnectorController } from '../controllers/connector.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class ConnectorRoutes implements Route {
  private controller: ConnectorController;
  private router: Router;
  private auth: AuthMiddleware;

  constructor(controller: ConnectorController, authMiddleware: AuthMiddleware) {
    this.controller = controller;
    this.auth = authMiddleware;
    this.router = Router();
  }

  getRouter() {
    this.router.get(
      '/connectors',
      (req, res, next) => this.auth.authorize(req, res, next),
      (req, res) => this.controller.paginate(req, res)
    );

    this.router.post(
      '/connectors',
      (req, res, next) => this.auth.authorize(req, res, next),
      (req, res) => this.controller.create(req, res)
    );

    this.router.put(
      '/connectors/:id',
      (req, res, next) => this.auth.authorize(req, res, next),
      (req, res) => this.controller.update(req, res)
    );

    this.router.delete(
      '/connectors/:id',
      (req, res, next) => this.auth.authorize(req, res, next),
      (req, res) => this.controller.remove(req, res)
    );

    return this.router;
  }
}
