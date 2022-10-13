import IHandler from './IHandler';

/* eslint-disable no-unused-vars */
type ISODate = string;

export type EventData<T = {}> = T & {
  principalId: string;
  timestamp: ISODate;
  eventType?: string;
};

interface IEventHandler<T = {}> extends IHandler<void, EventData<T>> {}

export default IEventHandler;
