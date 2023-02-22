import Mediator from './Mediator';
import StoreMediatorError from './errors/MediatorError';

export default class StoreMediator extends Mediator {
  public async send<R>(name: string, data: any): Promise<void | R> {
    const handler = this.hasHandler(name);

    if (!handler) {
      throw new StoreMediatorError(`There is no event with this name: ${name}`);
    }

    return handler.handle(data);
  }
}
