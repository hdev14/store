export default class StoreMediatorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, StoreMediatorError.prototype);
  }
}
