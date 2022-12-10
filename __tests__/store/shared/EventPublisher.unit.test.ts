import { EventData } from '@shared/abstractions/IEventHandler';
import Mediator from '@shared/abstractions/Mediator';
import EventPublisher from '@shared/EventPublisher';

class MediatorSub extends Mediator {
  public send<R, T = {}>(_name: string, _data: EventData<T>): Promise<void | R> {
    return Promise.resolve();
  }
}

describe("EventPublisher's unit tests", () => {
  it('instanciates all events', async () => {
    expect.assertions(3);

    const mediatorSub = new MediatorSub();

    const publisher = new EventPublisher(mediatorSub);

    const fakeEventObject = {
      send: () => console.info('test'),
    };

    const fakeEvent1 = jest.fn().mockImplementation(() => fakeEventObject);
    const fakeEvent2 = jest.fn().mockImplementation(() => fakeEventObject);
    const fakeEvent3 = jest.fn().mockImplementation(() => fakeEventObject);

    publisher.addEvent(fakeEvent1, { principalId: 'test1', timestamp: new Date().toISOString() });
    publisher.addEvent(fakeEvent2, { principalId: 'test2', timestamp: new Date().toISOString() });
    publisher.addEvent(fakeEvent3, { principalId: 'test3', timestamp: new Date().toISOString() });

    await publisher.sendEvents();

    expect(fakeEvent1).toHaveBeenCalledTimes(1);
    expect(fakeEvent2).toHaveBeenCalledTimes(1);
    expect(fakeEvent3).toHaveBeenCalledTimes(1);
  });

  it('calls all event send methods', async () => {
    expect.assertions(4);

    const mediatorSub = new MediatorSub();

    const publisher = new EventPublisher(mediatorSub);

    const fakeEventObject = {
      send: jest.fn().mockImplementation(() => console.info('test')),
    };

    const fakeEvent1 = jest.fn().mockImplementation(() => fakeEventObject);
    const fakeEvent2 = jest.fn().mockImplementation(() => fakeEventObject);
    const fakeEvent3 = jest.fn().mockImplementation(() => fakeEventObject);

    publisher.addEvent(fakeEvent1, { principalId: 'test1', timestamp: new Date().toISOString() });
    publisher.addEvent(fakeEvent2, { principalId: 'test2', timestamp: new Date().toISOString() });
    publisher.addEvent(fakeEvent3, { principalId: 'test3', timestamp: new Date().toISOString() });

    await publisher.sendEvents();

    expect(fakeEventObject.send).toHaveBeenCalledTimes(3);
    expect(fakeEventObject.send.mock.calls[0][0].principalId).toEqual('test1');
    expect(fakeEventObject.send.mock.calls[1][0].principalId).toEqual('test2');
    expect(fakeEventObject.send.mock.calls[2][0].principalId).toEqual('test3');
  });

  it('removes events from the list after send them', async () => {
    expect.assertions(2);

    const mediatorSub = new MediatorSub();

    const publisher = new EventPublisher(mediatorSub);

    const fakeEventObject1 = {
      send: jest.fn().mockImplementation(() => console.info('test_1')),
    };

    const fakeEventObject2 = {
      send: jest.fn().mockImplementation(() => console.info('test_2')),
    };

    const fakeEvent1 = jest.fn().mockImplementation(() => fakeEventObject1);
    const fakeEvent2 = jest.fn().mockImplementation(() => fakeEventObject1);
    const fakeEvent3 = jest.fn().mockImplementation(() => fakeEventObject1);

    publisher.addEvent(fakeEvent1, { principalId: 'test1', timestamp: new Date().toISOString() });
    publisher.addEvent(fakeEvent2, { principalId: 'test2', timestamp: new Date().toISOString() });
    publisher.addEvent(fakeEvent3, { principalId: 'test3', timestamp: new Date().toISOString() });

    await publisher.sendEvents();

    const fakeEvent4 = jest.fn().mockImplementation(() => fakeEventObject2);
    const fakeEvent5 = jest.fn().mockImplementation(() => fakeEventObject2);
    const fakeEvent6 = jest.fn().mockImplementation(() => fakeEventObject2);

    publisher.addEvent(fakeEvent4, { principalId: 'test1', timestamp: new Date().toISOString() });
    publisher.addEvent(fakeEvent5, { principalId: 'test2', timestamp: new Date().toISOString() });
    publisher.addEvent(fakeEvent6, { principalId: 'test3', timestamp: new Date().toISOString() });

    await publisher.sendEvents();

    expect(fakeEventObject1.send).toHaveBeenCalledTimes(3);
    expect(fakeEventObject2.send).toHaveBeenCalledTimes(3);
  });
});
