import './bootstrap';
import express from 'express';
import errorHandler from './middlewares/errorHandler';
import catalog from './routers/catalog';
import sales from './routers/sales';
import auth from './routers/auth';

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
    this._application.use('/users', sales);
    this._application.use('/auth', auth);
  }

  private setGlobalTopMiddlewares() {
    this._application.use(express.json());
  }

  private setGlobalBottomMiddlewares() {
    this._application.use(errorHandler);
  }
}

export default new Server();
