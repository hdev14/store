export default class ProductNotFoundError extends Error {
  constructor() {
    super('O produto não foi encontrado.');
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, ProductNotFoundError.prototype);
  }
}
