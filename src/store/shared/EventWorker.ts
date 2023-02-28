import Event from './abstractions/Event';
import IEventWorker from './abstractions/IEventWorker';

// TODO
export default class EventWorker implements IEventWorker {
  public async process(event: Event): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
