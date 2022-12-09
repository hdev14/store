import Mediator from './Mediator';

export default abstract class Command<R = void, T = {}> {
  protected readonly mediator: Mediator;

  constructor(mediator: Mediator) {
    this.mediator = mediator;
  }

  public async send(data: T): Promise<void | R> {
    return this.mediator.send<R>(this.constructor.name, data);
  }
}
