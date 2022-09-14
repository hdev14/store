import { EventData } from './@types/events';
import { EventConstructor } from './abstractions/Event';
import EventMediator from './abstractions/EventMediator';

export default class EventPublisher {
  private mediator: EventMediator;

  private events: Array<{ ctor: EventConstructor, data: EventData }>;

  constructor(mediator: EventMediator) {
    this.mediator = mediator;
    this.events = [];
  }

  addEvent<T>(ctor: EventConstructor, data: EventData<T>) {
    this.events.push({ ctor, data });
  }

  async sendEvents(): Promise<void> {
    const promises = this.events.map(async (event) => {
      const UnknownEvent = event.ctor;
      const unknownEvent = new UnknownEvent(this.mediator);
      await unknownEvent.send(event.data);
    });

    await Promise.all(promises);
  }
}
