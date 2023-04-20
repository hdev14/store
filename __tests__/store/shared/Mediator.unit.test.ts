/* eslint-disable max-classes-per-file */
import MediatorError from '@shared/errors/MediatorError';
import Mediator from '@shared/Mediator';
import IHandler from '@shared/abstractions/IHandler';
import Event from '@shared/abstractions/Event';

const handleMock = jest.fn();
const EventHandlerMock = jest.fn().mockImplementation(() => ({
  handle: handleMock,
}));

class EventHandlerStub implements IHandler {
  public async handle(event: any): Promise<any> {
    console.info(event);
  }
}

class EventStub extends Event { }

describe("Mediator's unit tests", () => {
  it('adds new event and handler', () => {
    const mediator = new Mediator();

    mediator.register('test1', new EventHandlerStub());
    mediator.register('test2', new EventHandlerStub());
    mediator.register('test3', new EventHandlerStub());

    expect(mediator.handlers.size).toEqual(3);
  });

  it('calls EventHandler.handle when is passed the event name', async () => {
    expect.assertions(2);

    const mediator = new Mediator();

    mediator.register(EventStub.name, new EventHandlerMock());

    const event = new EventStub();

    await mediator.send(event);

    expect(handleMock).toHaveBeenCalled();
    expect(handleMock).toHaveBeenCalledWith(event);
  });

  it("throws an exception of type MediatorError if event name doesn't exist", () => {
    expect.assertions(2);

    const mediator = new Mediator();

    return mediator.send(new EventStub()).catch((e: any) => {
      expect(e).toBeInstanceOf(MediatorError);
      expect(e.message).toEqual('There is no event with this name: EventStub');
    });
  });

  it('not adds the same even handler', () => {
    const mediator = new Mediator();

    const setSpy = jest.spyOn(mediator.handlers, 'set');

    mediator.register('test1', new EventHandlerStub());
    mediator.register('test1', new EventHandlerStub());

    expect(setSpy).toHaveBeenCalledTimes(1);
  });
});
