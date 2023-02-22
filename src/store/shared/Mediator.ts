import IHandler from './abstractions/IHandler';
import Event from './abstractions/Event';
import MediatorError from './errors/MediatorError';
import IMediator from './abstractions/IMediator';

export default class Mediator implements IMediator {
  private readonly _handlers: Map<string, IHandler> = new Map<string, IHandler>();

  get handlers() {
    return this._handlers;
  }

  public register(eventName: string, handler: IHandler) {
    if (!this._handlers.has(eventName)) {
      this._handlers.set(eventName, handler);
    }
  }

  public async send<R = any>(event: Event): Promise<void | R> {
    const handler = this._handlers.get(event.eventName) as IHandler<Event, R>;

    if (!handler) {
      throw new MediatorError(`There is no event with this name: ${event.eventName}`);
    }

    return handler.handle(event);
  }
}
