import { EventData } from './@types/events';
import EventMediator from './abstractions/EventMediator';
import StoreMediatorError from './errors/StoreMediatorError';

export default class StoreMediator extends EventMediator {
  async send<R>(name: string, data: EventData): Promise<void | R> {
    const handler = this.hasHandler(name);

    if (!handler) {
      throw new StoreMediatorError('There is no event with this name.');
    }

    return handler.handle(data);
  }
}
