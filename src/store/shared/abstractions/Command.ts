import Event from './Event';

export default abstract class Command extends Event {
  abstract validate(): boolean;
}
