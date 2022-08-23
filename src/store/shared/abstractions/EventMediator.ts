/* eslint-disable no-unused-vars */
import { EventData, IEventHandler } from '@shared/@types/events';

export default abstract class EventMediator {
  protected _handlers: Map<string, IEventHandler> = new Map<string, IEventHandler>();

  addEvent(name: string, handler: IEventHandler) {
    this._handlers.set(name, handler);
  }

  get handlers() {
    return this._handlers;
  }

  abstract send<R, T = {}>(name: string, data: EventData<T>): void | R | Promise<void | R>;

  protected hasHandler(name: string): IEventHandler {
    if (!this.handlers.has(name)) {
      throw new Error('There is no event with this name.');
    }

    return this.handlers.get(name)!;
  }
}
