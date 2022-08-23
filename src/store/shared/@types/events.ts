/* eslint-disable no-unused-vars */
export type EventData<T extends Record<string, any> = {}> = T;

export interface IEventHandler {
  handle<R = {}>(data: EventData): void | R | Promise<void | R>;
}
