export default class EventHandlerError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, EventHandlerError.prototype);
  }
}
