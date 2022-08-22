import { Event, EventMediator } from './abstractions/EventMediator';

export default class StoreMediator extends EventMediator {
  send<R, T = {}>(name: string, event: Event<T>): R | Promise<R> {
    console.info(name, event);
    throw new Error('Method not implemented.');
  }
}
