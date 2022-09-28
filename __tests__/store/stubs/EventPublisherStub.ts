import { EventData } from '@shared/@types/events';
import { EventConstructor } from '@shared/abstractions/Event';
import EventMediator from '@shared/abstractions/EventMediator';
import EventPublisher from '@shared/EventPublisher';

export class PublisherStup extends EventPublisher {
  addEvent<T>(ctor: EventConstructor, data: EventData<T>): void {
    console.info(ctor, data);
  }

  sendEvents(): Promise<void> {
    return Promise.resolve();
  }
}

export default new PublisherStup({} as EventMediator);
