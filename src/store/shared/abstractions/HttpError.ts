export default class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly body: Record<string, any>,
    options?: ErrorOptions
  ) {
    super(`HttpError - ${statusCode}`, options);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
