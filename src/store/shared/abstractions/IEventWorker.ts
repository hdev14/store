import Event from './Event';

interface IEventWorker {
  process(event: Event): Promise<void>;
}

export default IEventWorker;
