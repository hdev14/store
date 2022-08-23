import { EventData } from './@types/events';
import EventMediator from './abstractions/EventMediator';

export default class StoreMediator extends EventMediator {
  async send<R, T = {}>(name: string, data: EventData<T>): Promise<void | R> {
    const handler = this.hasHandler(name);

    return handler.handle<R>(data);
  }
}
