import Event from './Event';

interface IEventQueue {
  /** @throws {QueueError} */
  enqueue(event: Event): Promise<void>

  /** @throws {QueueError} */
  enqueueInBatch(events: Event[]): Promise<void>;

  /** @throws {QueueError} */
  closeConnection(): Promise<void>;
}

export default IEventQueue;
