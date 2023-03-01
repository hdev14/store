import { Job, Processor } from 'bullmq';
import IEventWorker from './abstractions/IEventWorker';
import IMediator from './abstractions/IMediator';
import Event from './abstractions/Event';

export default class BullmqEventWorker implements IEventWorker<Parameters<Processor>> {
  constructor(private readonly eventMediator: IMediator) { }

  public async process(job: Job<Event, any, string>, token?: string | undefined): Promise<void> {
    await this.eventMediator.send(job.data);
  }
}
