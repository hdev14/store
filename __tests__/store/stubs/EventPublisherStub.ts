import { EventConstructor } from '@shared/abstractions/Event';
import { EventData } from '@shared/abstractions/IEventHandler';
import Mediator from '@shared/abstractions/Mediator';
import EventPublisher from '@shared/EventPublisher';

export class PublisherStup extends EventPublisher {
  addEvent<T>(ctor: EventConstructor, data: EventData<T>): void {
    console.info(ctor, data);
  }

  sendEvents(): Promise<void> {
    return Promise.resolve();
  }
}

export default new PublisherStup({} as Mediator);
