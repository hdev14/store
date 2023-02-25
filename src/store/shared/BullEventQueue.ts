import Event from './abstractions/Event';
import IEventQueue from './abstractions/IEventQueue';

// TODO: implement with bullmq
export default class BullEventQueue implements IEventQueue {
  public async enqueue(event: Event): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async closeConnection(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
