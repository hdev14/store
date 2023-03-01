import { Job, Processor } from 'bullmq';
import IEventWorker from './abstractions/IEventWorker';
import IMediator from './abstractions/IMediator';

// TODO
export default class BullmqEventWorker implements IEventWorker<Parameters<Processor>> {
  constructor(private readonly mediator: IMediator) {

  }

  public async process(job: Job<any, any, string>, token?: string | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
