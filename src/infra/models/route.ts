import { Router } from 'express';

export interface Route {
  getRouter(): Router;
}
