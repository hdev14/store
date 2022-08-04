export default class CategoryNotFoundError extends Error {
  constructor() {
    super('A category não foi encontrada.');
    this.name = this.constructor.name;
  }
}
