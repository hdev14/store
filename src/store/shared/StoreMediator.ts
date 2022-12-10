import Mediator from './abstractions/Mediator';
import StoreMediatorError from './errors/StoreMediatorError';

export default class StoreMediator extends Mediator {
  public async send<R>(name: string, data: any): Promise<void | R> {
    const handler = this.hasHandler(name);

    if (!handler) {
      throw new StoreMediatorError(`There is no event with this name: ${name}`);
    }

    console.info(`Event name: ${name}`);

    return handler.handle(data);
  }
}
