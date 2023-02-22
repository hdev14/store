import Event from './Event';

export default abstract class Command extends Event {
  protected abstract validate(): void;
}
