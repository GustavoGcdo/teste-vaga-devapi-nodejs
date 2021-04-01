import cors from 'cors';
import express, { Application } from 'express';
import mongoose, { Connection } from 'mongoose';
import config from './config';
import { makeAuthRoutes } from './factories/auth-route.factory';
import { makeInfoRoutes } from './factories/info-route.factory';

export class App {
  private app: Application;

  constructor() {
    this.app = express();
  }

  public async create(): Promise<Application> {
    this.configureMiddleWares();
    this.configureRoutes();
    await this.connectToDatabase();
    return this.app;
  }

  private configureMiddleWares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private configureRoutes() {
    this.app.use(makeInfoRoutes().getRouter());
    this.app.use(makeAuthRoutes().getRouter());
  }

  private async connectToDatabase() {
    return mongoose.connect(config.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  public start(): void {
    this.app.listen(config.PORT, () => {
      console.log(`listen on port ${config.PORT}`);
    });
  }

  public getApplication(): Application {
    return this.app;
  }

  public getConnection(): Connection {
    return mongoose.connection;
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}
