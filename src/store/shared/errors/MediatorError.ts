export default class MediatorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, MediatorError.prototype);
  }
}
