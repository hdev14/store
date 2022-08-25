/* eslint-disable no-unused-vars */
type ISODate = string;

export type EventData<T = {}> = T & {
  principalId: string;
  timestamp: ISODate;
};

export interface IEventHandler {
  handle<R = {}>(data: EventData): void | R | Promise<void | R>;
}
