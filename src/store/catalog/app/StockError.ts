export default class StockError extends Error {
  constructor() {
    super('Não foi possível atualizar o estoque do produto.');
    this.name = this.constructor.name;
  }
}
