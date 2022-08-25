/* eslint-disable no-unused-vars */
type ISODate = string;

export type EventData<T = {}> = T & {
  principalId: string;
  datetime: ISODate;
};

export interface IEventHandler {
  handle<R = {}>(data: EventData): void | R | Promise<void | R>;
}
