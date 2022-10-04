import { EventData } from '@shared/@types/events';
import EventMediator from '@shared/abstractions/EventMediator';

export class MediatorStub extends EventMediator {
  public send<R, T = {}>(_name: string, _data: EventData<T>): Promise<void | R> {
    return Promise.resolve();
  }
}

export default new MediatorStub();