import Event from './Event';

export default abstract class Command extends Event {
  public abstract validate(): boolean;
}
