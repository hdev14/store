export type GenericError = {
  field: string;
  messages: string[];
}

export default class ValidationError extends Error {
  public errors: GenericError[] = [];

  constructor(errors: GenericError[]) {
    super('ValidationError');
    this.errors = errors;
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
