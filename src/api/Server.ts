import express from 'express';
import errorHandler from './middlewares/errorHandler';
import catalog from './routers/catalog';

export class Server {
  private _application: express.Application;

  constructor() {
    this._application = express();
    this.setTopMiddlewares();
    this.setRoutes();
    this.setBottomMiddlewares();
  }

  get application() {
    return this._application;
  }

  private setRoutes() {
    this._application.use('/catalog', catalog);
  }

  private setTopMiddlewares() {
    this._application.use(express.json());
  }

  private setBottomMiddlewares() {
    this._application.use(errorHandler);
  }
}

export default new Server();
