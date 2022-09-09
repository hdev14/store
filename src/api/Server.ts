import express from 'express';
import errorHandler from './middlewares/errorHandler';
import catalog from './routers/catalog';
import sales from './routers/sales';

export class Server {
  private _application: express.Application;

  constructor() {
    this._application = express();
    this.setGlobalTopMiddlewares();
    this.setApplicationRouters();
    this.setGlobalBottomMiddlewares();
  }

  get application() {
    return this._application;
  }

  private setApplicationRouters() {
    this._application.use('/catalog', catalog);
    this._application.use('/sales', sales);
  }

  private setGlobalTopMiddlewares() {
    this._application.use(express.json());
  }

  private setGlobalBottomMiddlewares() {
    this._application.use(errorHandler);
  }
}

export default new Server();
