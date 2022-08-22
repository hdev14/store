import { EventData, EventHandlerReturn, EventMediator } from './abstractions/EventMediator';

export default class StoreMediator extends EventMediator {
  send<R, T = {}>(name: string, data: EventData<T>): EventHandlerReturn<R> {
    const handler = this.hasHandler(name);

    return handler.handle<R>(data);
  }
}
