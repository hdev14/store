import IHandler from './IHandler';
import Event from './Event';

interface IMediator {
  /** @throws {MediatorError} */
  register(eventName: string, handler: IHandler): void;

  /** @throws {MediatorError} */
  send<R = any>(event: Event): Promise<void | R>;
}

export default IMediator;
