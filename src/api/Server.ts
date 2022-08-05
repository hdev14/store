import express from 'express';
import catalog from './routers/catalog';

export class Server {
  private _application: express.Application;

  constructor() {
    this._application = express();
    this.globalMiddlewares();
    this.routes();
  }

  get application() {
    return this._application;
  }

  private routes() {
    this._application.use('/catalog', catalog);
  }

  private globalMiddlewares() {
    this._application.use(express.json());
  }
}

export default new Server();
