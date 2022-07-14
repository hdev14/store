type GenericError = {
  field: string;
  messages: string[];
}

export default class ValidationEntityError extends Error {
  public errors: GenericError[] = [];

  constructor(errors: GenericError[]) {
    super('ValidationEntityError');
    this.errors = errors;
  }
}
