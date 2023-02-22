export default abstract class Event {
  public readonly eventName: string;

  public readonly date: Date;

  constructor() {
    this.eventName = this.constructor.name;
    this.date = new Date();
  }
}
