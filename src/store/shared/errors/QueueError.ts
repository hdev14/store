export default class QueueError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, QueueError.prototype);
  }
}
