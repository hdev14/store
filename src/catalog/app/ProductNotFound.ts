export default class ProductNotFound extends Error {
  constructor() {
    super('O produto não foi encontrado.');
    this.name = this.constructor.name;
  }
}
