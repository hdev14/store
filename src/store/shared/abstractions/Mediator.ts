/* eslint-disable no-unused-vars */
import IHandler from './IHandler';

export default abstract class Mediator {
  protected _handlers: Map<string, IHandler> = new Map<string, IHandler>();

  public addEvent(name: string, handler: IHandler) {
    if (!this.hasHandler(name)) {
      this._handlers.set(name, handler);
    }
  }

  get handlers() {
    return this._handlers;
  }

  public abstract send<R>(name: string, data: any): Promise<void | R>;

  protected hasHandler(name: string): IHandler | null {
    if (!this.handlers.has(name)) {
      return null;
    }

    return this.handlers.get(name)!;
  }
}
