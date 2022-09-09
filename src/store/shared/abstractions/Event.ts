/* eslint-disable no-unused-vars */
import { EventData } from '@shared/@types/events';
import EventMediator from './EventMediator';

export abstract class Event<R = {}, T = {}> {
  protected mediator: EventMediator;

  constructor(mediator: EventMediator) {
    this.mediator = mediator;
  }

  public async send(data: EventData<T>): Promise<void | R> {
    return this.mediator.send<R>(this.constructor.name, data);
  }
}

export interface EventConstructor {
  new(mediator: EventMediator): Event;
}

export default Event;
