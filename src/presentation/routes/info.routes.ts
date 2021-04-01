import { Router } from 'express';
import { Route } from '../../infra/models/route';
import { InfoController } from '../controllers/info.controller';

export class InfoRoutes implements Route {
  private infoController: InfoController;
  private router: Router;

  constructor(controller: InfoController) {
    this.infoController = controller;
    this.router = Router();
  }

  getRouter() {
    this.router.get('/', (req, res) => this.infoController.getInfo(req, res));

    return this.router;
  }
}
