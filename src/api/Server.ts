import express from 'express';
import errorHandler from './middlewares/errorHandler';
import catalog from './routers/catalog';

export class Server {
  private _application: express.Application;

  constructor() {
    this._application = express();
    this.setGlobalTopMiddlewares();
    this.setApplicationRoutes();
    this.setGlobalBottomMiddlewares();
  }

  get application() {
    return this._application;
  }

  private setApplicationRoutes() {
    this._application.use('/catalog', catalog);
  }

  private setGlobalTopMiddlewares() {
    this._application.use(express.json());
  }

  private setGlobalBottomMiddlewares() {
    this._application.use(errorHandler);
  }
}

export default new Server();
