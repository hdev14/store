import Event from './Event';

interface IEventQueue {
  // TODO: add overload to enqueue a bulk of events
  enqueue(event: Event): Promise<void>

  closeConnection(): Promise<void>;
}

export default IEventQueue;
