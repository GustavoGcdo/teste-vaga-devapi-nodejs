import { Router } from 'express';
import { Route } from '../../infra/models/route';
import { AuthController } from '../controllers/auth.controller';

export class AuthRoutes implements Route {
  private controller: AuthController;
  private router: Router;

  constructor(controller: AuthController) {
    this.controller = controller;
    this.router = Router();
  }

  getRouter() {
    this.router.post('/auth/signup', (req, res) => this.controller.signup(req, res));
    this.router.post('/auth/login', (req, res) => this.controller.login(req, res));

    return this.router;
  }
}
