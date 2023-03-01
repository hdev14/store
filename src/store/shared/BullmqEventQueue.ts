import { Queue } from 'bullmq';
import Event from './abstractions/Event';
import IEventQueue from './abstractions/IEventQueue';
import QueueError from './errors/QueueError';

export default class BullmqEventQueue implements IEventQueue {
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
    try {
      await this.queue.add(event.eventName, event);
    } catch (e: any) {
      throw new QueueError(e.message, { cause: e.stack });
    }
  }

  public async enqueueInBatch(events: Event[]): Promise<void> {
    try {
      await this.queue.addBulk(events.map((event) => ({
        name: event.eventName,
        data: event,
      })));
    } catch (e: any) {
      throw new QueueError(e.message, { cause: e.stack });
    }
  }

  public async closeConnection(): Promise<void> {
    try {
      await this.queue.close();
    } catch (e: any) {
      throw new QueueError(e.message, { cause: e.stack });
    }
  }
}
