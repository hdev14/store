import IHandler from './IHandler';

type ISODate = string;

export type EventData<T = object> = T & {
  principalId: string;
  timestamp: ISODate;
  eventType?: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IEventHandler<T = object> extends IHandler<void, EventData<T>> {}

export default IEventHandler;
