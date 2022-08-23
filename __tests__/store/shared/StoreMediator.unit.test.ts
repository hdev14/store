import { EventData, IEventHandler } from '@shared/@types/events';
import EventMediatorError from '@shared/errors/EventMediatorError';
import StoreMediator from '@shared/StoreMediator';

const handleMock = jest.fn(() => { });
const EventHandlerMock = jest.fn().mockImplementation(() => ({
  handle: handleMock,
}));

class EventHandlerStub implements IEventHandler {
  handle(data: EventData<{}>): void {
    console.info(data);
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

    const expectedEvent = { test: 'test event handler' };

    storeMediator.addEvent('test1', new EventHandlerMock());
    await storeMediator.send('test1', expectedEvent);

    expect(handleMock).toHaveBeenCalled();
    expect(handleMock).toHaveBeenCalledWith(expectedEvent);
  });

  it("throws an exception of type EventMediatorError if event name doesn't exist", async () => {
    expect.assertions(2);
    try {
      const storeMediator = new StoreMediator();

      await storeMediator.send('test1', {});
    } catch (e: any) {
      expect(e).toBeInstanceOf(EventMediatorError);
      expect(e.message).toEqual('There is no event with this name.');
    }
  });
});
