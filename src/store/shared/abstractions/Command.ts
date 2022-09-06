/* eslint-disable no-unused-vars */
import { EventData } from '@shared/@types/events';
import Event from './Event';

export default abstract class Command<R, T> extends Event<R, T> {
  public abstract validate(data: EventData<T>): boolean | void;
}
