import { AuthService } from '../modules/auth/service/auth.service';
import { Signup } from '../modules/auth/use-cases/signup';
import { EncriptService } from '../modules/shared/services/encript.service.interface';
import { MongoDBUserRepository } from '../modules/users/repositories/mongodb-user.repository';
import { AuthController } from '../presentation/controllers/auth.controller';
import { AuthRoutes } from '../presentation/routes/auth.routes';

export const makeAuthRoutes = (): AuthRoutes => {
  const userRepository = new MongoDBUserRepository();
  const encriptService = new EncriptService();
  const authService = new AuthService();
  const signup = new Signup(userRepository, encriptService, authService);
  const controller = new AuthController(signup);
  const route = new AuthRoutes(controller);
  return route;
};
