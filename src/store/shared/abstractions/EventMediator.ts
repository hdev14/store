/* eslint-disable no-unused-vars */
export type Event<T extends Record<string, any> = {}> = T;

export interface IEventHandler {
  handle<R = {}>(event: Event): void | R | Promise<R>;
}

export abstract class EventMediator {
  protected _handlers: Map<string, IEventHandler> = new Map<string, IEventHandler>();

  addEvent(name: string, handler: IEventHandler) {
    this._handlers.set(name, handler);
  }

  get handlers() {
    return this._handlers;
  }

  abstract send<R, T = {}>(name: string, event: Event<T>): R | Promise<R>;

  private hasHandler(name: string): IEventHandler {
    if (!this.handlers.has(name)) {
      throw new Error('There is no event with this name.');
    }

    return this.handlers.get(name)!;
  }
}
