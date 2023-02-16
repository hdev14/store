import { EventConstructor } from './abstractions/Event';
import { EventData } from './abstractions/IEventHandler';
import Mediator from './abstractions/Mediator';

export default class EventPublisher {
  private events: Array<{ ctor: EventConstructor, data: EventData }>;

  constructor(private readonly mediator: Mediator) {
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

    this.events = [];
  }
}
