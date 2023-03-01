import IHandler from './abstractions/IHandler';
import IMediator from './abstractions/IMediator';
import Event from './abstractions/Event';
import MediatorError from './errors/MediatorError';

export default class EventMediator implements IMediator {
  private _handlers: Map<string, IHandler[]> = new Map<string, IHandler[]>();

  get handlers() {
    return this._handlers;
  }

  public register(eventName: string, handler: IHandler) {
    if (this._handlers.has(eventName)) {
      this.registerNewHandler(eventName, handler);
      return;
    }

    this._handlers.set(eventName, [handler]);
  }

  public async send<R = any>(event: Event): Promise<void> {
    if (!this._handlers.has(event.eventName)) {
      throw new MediatorError('There is no event with this name.');
    }

    const eventHandlers = this._handlers.get(event.eventName) as IHandler<Event, R>[];

    const promises = eventHandlers.map((handler) => handler.handle(event));

    await Promise.all(promises);
  }

  private registerNewHandler(eventName: string, newHandler: IHandler) {
    const currentHandlers = this._handlers.get(eventName)!;

    const containsHandler = currentHandlers
      .reverse()
      .some((currentHandler) => newHandler.constructor.name === currentHandler.constructor.name);

    if (containsHandler) {
      throw new MediatorError('Handler already registered');
    }

    this._handlers.set(eventName, [...currentHandlers, newHandler]);
  }
}
