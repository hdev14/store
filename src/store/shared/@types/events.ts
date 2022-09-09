/* eslint-disable no-unused-vars */
type ISODate = string;

export type EventData<T = {}> = T & {
  principalId: string;
  timestamp: ISODate;
};

export interface IEventHandler<R = any> {
  handle(data: EventData): Promise<R>;
}
