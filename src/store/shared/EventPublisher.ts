import { EventData } from './@types/events';
import { EventConstructor } from './abstractions/Event';
import EventMediator from './abstractions/EventMediator';

export default class EventPublisher {
  private readonly mediator: EventMediator;

  private events: Array<{ ctor: EventConstructor, data: EventData }>;

  constructor(mediator: EventMediator) {
    this.mediator = mediator;
    this.events = [];
  }

  public addEvent<T>(ctor: EventConstructor, data: EventData<T>) {
    this.events.push({ ctor, data });
  }

  public async sendEvents(): Promise<void> {
    const promises = this.events.map(async (event) => {
      const UnknownEvent = event.ctor;
      const unknownEvent = new UnknownEvent(this.mediator);
      await unknownEvent.send(event.data);
    });

    await Promise.all(promises);
  }
}
