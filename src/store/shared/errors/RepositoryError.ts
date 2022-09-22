export default class RepositoryError extends Error {
  constructor(repository: string, message: string) {
    super(`${repository} - ${message}`);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, RepositoryError.prototype);
  }
}
