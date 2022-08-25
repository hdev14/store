import { EventData } from '@shared/@types/events';
import EventMediator from './EventMediator';

export default abstract class Event<R = {}, E = {}> {
  private mediator: EventMediator;

  constructor(mediator: EventMediator) {
    this.mediator = mediator;
  }

  public async send(data: EventData<E>): Promise<void | R> {
    return this.mediator.send<R>(this.constructor.name, data);
  }
}
