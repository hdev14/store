export default class EventHandlerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, EventHandlerError.prototype);
  }
}
