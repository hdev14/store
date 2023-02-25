import { queueConstructorMock } from '@mocks/bullqm/dist/esm';
import BullEventQueue from '@shared/BullEventQueue';

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
});
