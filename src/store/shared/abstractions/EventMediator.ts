/* eslint-disable no-unused-vars */
import { EventData, IEventHandler } from '@shared/@types/events';

export default abstract class EventMediator {
  protected _handlers: Map<string, IEventHandler> = new Map<string, IEventHandler>();

  public addEvent(name: string, handler: IEventHandler) {
    if (!this.hasHandler(name)) {
      this._handlers.set(name, handler);
    }
  }

  get handlers() {
    return this._handlers;
  }

  public abstract send<R, T = {}>(name: string, data: EventData<T>): Promise<void | R>;

  protected hasHandler(name: string): IEventHandler | null {
    if (!this.handlers.has(name)) {
      return null;
    }

    return this.handlers.get(name)!;
  }
}
