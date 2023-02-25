import { Queue } from 'bullmq';
import Event from './abstractions/Event';
import IEventQueue from './abstractions/IEventQueue';

export default class BullEventQueue implements IEventQueue {
  private readonly queue: Queue;

  constructor() {
    const {
      REDIS_HOST,
      REDIS_PORT,
      EVENT_QUEUE_NAME,
      EVENT_QUEUE_ATTEMPTS,
      EVENT_QUEUE_DELAY,
    } = process.env;

    this.queue = new Queue(EVENT_QUEUE_NAME!, {
      connection: {
        host: REDIS_HOST,
        port: parseInt(REDIS_PORT!, 10),
      },
      defaultJobOptions: {
        attempts: parseInt(EVENT_QUEUE_ATTEMPTS!, 10),
        backoff: { type: 'fixed', delay: parseInt(EVENT_QUEUE_DELAY!, 10) },
      },
    });
  }

  public async enqueue(event: Event): Promise<void> {
    await this.queue.add('event', event);
  }

  public async closeConnection(): Promise<void> {
    await this.queue.close();
  }
}
