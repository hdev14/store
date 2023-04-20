/* eslint-disable max-classes-per-file */
import IHandler from '@shared/abstractions/IHandler';
import MediatorError from '@shared/errors/MediatorError';
import EventMediator from '@shared/EventMediator';
import { mock } from 'jest-mock-extended';
import Event from '@shared/abstractions/Event';

class HandlerStub1 implements IHandler {
  handle(event: any): Promise<any> {
    return Promise.resolve();
  }
}

class HandlerStub2 implements IHandler {
  handle(event: any): Promise<any> {
    return Promise.resolve();
  }
}

describe("EventMediator's unit tests", () => {
  describe('EventMediator.register()', () => {
    it('adds a new handler', () => {
      const handlerStub = new HandlerStub1();

      const mediator = new EventMediator();

      mediator.register('event', handlerStub);

      expect(mediator.handlers.size).toEqual(1);
    });

    it('adds two handler to the same event name', () => {
      const handlerStub1 = new HandlerStub1();

      const handlerStub2 = new HandlerStub2();

      const mediator = new EventMediator();

      mediator.register('event', handlerStub1);
      mediator.register('event', handlerStub2);

      expect(mediator.handlers.size).toEqual(1);
    });

    it('throws a MediatorError if is registered the same handler', () => {
      const handlerStub1 = new HandlerStub1();

      const mediator = new EventMediator();

      mediator.register('event', handlerStub1);

      expect(() => mediator.register('event', handlerStub1)).toThrow(MediatorError);
    });
  });

  describe('EventMediator.send()', () => {
    it('calls handler.handle with correct event', async () => {
      expect.assertions(1);

      const event = mock<Event>({
        eventName: 'test',
        date: new Date(),
      });

      const handlerStub1 = new HandlerStub1();
      const handleSpy = jest.spyOn(handlerStub1, 'handle');

      const mediator = new EventMediator();
      mediator.register('test', handlerStub1);

      await mediator.send(event);

      expect(handleSpy).toHaveBeenCalledWith(event);
    });

    it('calls multi-handler methods with correct event', async () => {
      expect.assertions(2);

      const event = mock<Event>({
        eventName: 'test',
        date: new Date(),
      });

      const handlerStub1 = new HandlerStub1();
      const handleSpy1 = jest.spyOn(handlerStub1, 'handle');

      const handlerStub2 = new HandlerStub2();
      const handleSpy2 = jest.spyOn(handlerStub2, 'handle');

      const mediator = new EventMediator();
      mediator.register('test', handlerStub1);
      mediator.register('test', handlerStub2);

      await mediator.send(event);

      expect(handleSpy1).toHaveBeenCalledWith(event);
      expect(handleSpy2).toHaveBeenCalledWith(event);
    });

    it('throws a MediatorError if there is no handler registered for the event', () => {
      expect.assertions(2);

      const event = mock<Event>({
        eventName: 'test',
        date: new Date(),
      });

      const mediator = new EventMediator();

      return mediator.send(event).catch((e: any) => {
        expect(e).toBeInstanceOf(MediatorError);
        expect(e.message).toEqual('There is no event with this name.');
      });
    });
  });
});
