import Mediator from '@shared/abstractions/Mediator';

export class MediatorStub extends Mediator {
  public send<R>(_name: string, _data: any): Promise<void | R> {
    return Promise.resolve();
  }
}

export default new MediatorStub();
