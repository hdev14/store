import { EventData } from './IEventHandler';
import Mediator from './Mediator';

export abstract class Event<T = Record<string, any>> {
  constructor(protected readonly mediator: Mediator) { }

  public async send(data: EventData<T>): Promise<void> {
    return this.mediator.send<void>(this.constructor.name, {
      ...data,
      eventType: this.constructor.name,
    });
  }
}

export interface EventConstructor {
  new(mediator: Mediator): Event;
}

export default Event;
