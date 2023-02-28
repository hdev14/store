import Event from './Event';

interface IEventQueue {
  enqueue(event: Event): Promise<void>

  enqueueInBach(events: Event[]): Promise<void>;

  closeConnection(): Promise<void>;
}

export default IEventQueue;
