export default class CategoryNotFoundError extends Error {
  constructor() {
    super('A categoria não foi encontrada.');
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, CategoryNotFoundError.prototype);
  }
}
