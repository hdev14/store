import Event from '@shared/abstractions/Event';
import IHandler from '@shared/abstractions/IHandler';
import IMediator from '@shared/abstractions/IMediator';

export class MediatorStub implements IMediator {
  register(eventName: string, handler: IHandler<any, any>): void {
    throw new Error('Method not implemented.');
  }

  send<R = any>(event: Event): Promise<void | R> {
    return Promise.resolve();
  }
}

export default new MediatorStub();
