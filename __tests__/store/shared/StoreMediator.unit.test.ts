import { Event, IEventHandler } from '@shared/abstractions/EventMediator';
import StoreMediator from '@shared/StoreMediator';

class TestHandler implements IEventHandler {
  handle<R = {}>(event: Event<{}>): void | R | Promise<R> {
    console.info(event);
  }
}

describe("StoreMediator's unit tests", () => {
  it('adds new event and handler', () => {
    const storeMediator = new StoreMediator();

    storeMediator.addEvent('test1', new TestHandler());
    storeMediator.addEvent('test2', new TestHandler());
    storeMediator.addEvent('test3', new TestHandler());

    expect(storeMediator.handlers.size).toEqual(3);
  });
});
