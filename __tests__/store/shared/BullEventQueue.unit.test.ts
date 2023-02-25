import BullEventQueue from '@shared/BullEventQueue';
import Event from '@shared/abstractions/Event';
import QueueError from '@shared/errors/QueueError';
import { Queue } from 'bullmq';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

const queueMock = mockDeep<Queue>() as unknown as DeepMockProxy<Queue>;

jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => queueMock),
}));

class EventStub extends Event { }

describe("BullEventQueue's unit tests", () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = {
      ...OLD_ENV,
      EVENT_QUEUE_NAME: 'event_queue_test',
      EVENT_QUEUE_ATTEMPTS: '3',
      EVENT_QUEUE_DELAY: '1000',
      REDIS_HOST: 'http://test.redis',
      REDIS_PORT: '6379',
    };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('instanciates a new bullmq.Queue with correct params', () => {
    const queueConstructorMock = jest.mocked(Queue);

    // eslint-disable-next-line no-new
    new BullEventQueue();

    expect(queueConstructorMock).toHaveBeenCalledTimes(1);
    expect(queueConstructorMock).toHaveBeenCalledWith(
      'event_queue_test',
      {
        connection: {
          host: 'http://test.redis',
          port: 6379,
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'fixed',
            delay: 1000,
          },
        },
      },
    );
  });

  describe('BullEventQueue.enqueue()', () => {
    it('calls Queue.add with the correct Event', async () => {
      expect.assertions(1);

      const bullEventQueue = new BullEventQueue();

      const eventStub = new EventStub();

      await bullEventQueue.enqueue(eventStub);

      expect(queueMock.add).toHaveBeenCalledWith('event', eventStub);
    });

    it('throws a QueueError if occur an unexpected error', async () => {
      expect.assertions(2);

      queueMock.add.mockRejectedValueOnce(new Error('test'));

      const bullEventQueue = new BullEventQueue();

      try {
        await bullEventQueue.enqueue(new EventStub());
      } catch (e: any) {
        expect(e).toBeInstanceOf(QueueError);
        expect(e.message).toEqual('test');
      }
    });
  });

  describe('BullEventQueue.closeConnection()', () => {
    it('calls Queue.close method', async () => {
      expect.assertions(1);

      const bullEventQueue = new BullEventQueue();

      await bullEventQueue.closeConnection();

      expect(queueMock.close).toHaveBeenCalled();
    });

    it('throws a QueueError if occur an unexpected error', async () => {
      expect.assertions(2);

      queueMock.close.mockRejectedValueOnce(new Error('test'));

      const bullEventQueue = new BullEventQueue();

      try {
        await bullEventQueue.closeConnection();
      } catch (e: any) {
        expect(e).toBeInstanceOf(QueueError);
        expect(e.message).toEqual('test');
      }
    });
  });
});
