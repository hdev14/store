/* eslint-disable no-unused-vars */
import { EventData } from './IEventHandler';
import Mediator from './Mediator';

export abstract class Event<T = {}> {
  protected readonly mediator: Mediator;

  constructor(mediator: Mediator) {
    this.mediator = mediator;
  }

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
