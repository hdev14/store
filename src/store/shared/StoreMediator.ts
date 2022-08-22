import { Event, EventHandlerReturn, EventMediator } from './abstractions/EventMediator';

export default class StoreMediator extends EventMediator {
  send<R, T = {}>(name: string, event: Event<T>): EventHandlerReturn<R> {
    const handler = this.hasHandler(name);

    return handler.handle<R>(event);
  }
}
