import { EventData } from '@shared/@types/events';
import EventMediator from './EventMediator';

export default abstract class Event<R = {}, T = {}> {
  private mediator: EventMediator;

  constructor(mediator: EventMediator) {
    this.mediator = mediator;
  }

  public async send(data: EventData<T>): Promise<void | R> {
    return this.mediator.send<R>(this.constructor.name, data);
  }
}
