import IMediator from '@shared/abstractions/IMediator';
import BullmqEventWorker from '@shared/BullmqEventWorker';
import { Job } from 'bullmq';
import { mock } from 'jest-mock-extended';
import Event from '@shared/abstractions/Event';

class EventStub extends Event {}

describe("BullmqEventWorker's unit tests", () => {
  it('calls EventMediator.send with correct event', async () => {
    expect.assertions(1);

    const eventMediatorMock = mock<IMediator>();
    const eventStub = new EventStub();

    const jobMock = mock<Job<Event, any, string>>({
      data: eventStub,
    });

    const bullmqEventWorker = new BullmqEventWorker(eventMediatorMock);

    await bullmqEventWorker.process(jobMock);

    expect(eventMediatorMock.send).toHaveBeenCalledWith(eventStub);
  });
});
