import IHandler from './IHandler';
import Event from './Event';

interface IMediator {
  register(eventName: string, handler: IHandler): void;

  send<R = any>(event: Event): Promise<void | R>;
}

export default IMediator;
