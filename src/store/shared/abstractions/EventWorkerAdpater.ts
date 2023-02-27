import IEventWorker from './IEventWorker';

export default abstract class EventWorkerAdapter<Params extends Array<any>> {
  constructor(protected readonly worker: IEventWorker) { }

  abstract process(...params: Params): Promise<void>;
}
