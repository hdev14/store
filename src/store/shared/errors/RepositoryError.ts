export default class RepositoryError extends Error {
  constructor(repository: string, message: string, options?: ErrorOptions) {
    super(`${repository} - ${message}`, options);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, RepositoryError.prototype);
  }
}
