import Event from './Event';

interface IEventQueue {
  enqueue(event: Event): Promise<void>

  enqueueInBatch(events: Event[]): Promise<void>;

  closeConnection(): Promise<void>;
}

export default IEventQueue;
