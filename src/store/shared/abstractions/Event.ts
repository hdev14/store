import { EventData } from '@shared/@types/events';
import EventMediator from './EventMediator';

export default abstract class Event {
  private mediator: EventMediator;

  constructor(mediator: EventMediator) {
    this.mediator = mediator;
  }

  async send<R>(data: EventData): Promise<void | R> {
    return this.mediator.send<R>(this.constructor.name, data);
  }
}
