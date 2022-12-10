import IEventHandler, { EventData } from '@shared/abstractions/IEventHandler';
import StoreMediatorError from '@shared/errors/StoreMediatorError';
import StoreMediator from '@shared/StoreMediator';

const handleMock = jest.fn(() => { });
const EventHandlerMock = jest.fn().mockImplementation(() => ({
  handle: handleMock,
}));

class EventHandlerStub implements IEventHandler {
  async handle(data: EventData<{}>): Promise<void> {
    console.info(data);
    return Promise.resolve();
  }
}

describe("StoreMediator's unit tests", () => {
  it('adds new event and handler', () => {
    const storeMediator = new StoreMediator();

    storeMediator.addEvent('test1', new EventHandlerStub());
    storeMediator.addEvent('test2', new EventHandlerStub());
    storeMediator.addEvent('test3', new EventHandlerStub());

    expect(storeMediator.handlers.size).toEqual(3);
  });

  it('calls EventHandler.handle when is passed the event name', async () => {
    expect.assertions(2);

    const storeMediator = new StoreMediator();

    const expectedEventData: EventData = {
      principalId: 'test', timestamp: new Date().toISOString(),
    };

    storeMediator.addEvent('test1', new EventHandlerMock());
    await storeMediator.send('test1', expectedEventData);

    expect(handleMock).toHaveBeenCalled();
    expect(handleMock).toHaveBeenCalledWith(expectedEventData);
  });

  it("throws an exception of type EventMediatorError if event name doesn't exist", async () => {
    expect.assertions(2);
    try {
      const storeMediator = new StoreMediator();

      await storeMediator.send('test1', {
        principalId: 'test',
        timestamp: new Date().toISOString(),
      });
    } catch (e: any) {
      expect(e).toBeInstanceOf(StoreMediatorError);
      expect(e.message).toEqual('There is no event with this name: test1');
    }
  });

  it('not adds the same even handler', () => {
    const storeMediator = new StoreMediator();

    const setSpy = jest.spyOn(storeMediator.handlers, 'set');

    storeMediator.addEvent('test1', new EventHandlerStub());
    storeMediator.addEvent('test1', new EventHandlerStub());

    expect(setSpy).toHaveBeenCalledTimes(1);
  });
});
